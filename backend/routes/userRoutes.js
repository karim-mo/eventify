import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/auth.js';
import User from '../models/UserModel.js';
import Event from '../models/EventModel.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		if (!user.isConfirmed) {
			res.status(401);
			throw new Error(
				'Email is not verified, please check your email to finish verification or try re-registering to re-send a verification to your email.'
			);
		}
		const checkPw = await user.matchPassword(password);
		if (checkPw) {
			res.json({
				email: user.email,
				name: user.name,
				country: user.country,
				cart: user.cart,
				token: jwt.sign({ id: user._id }, process.env.JWT_KEY, {
					expiresIn: '1d',
				}),
			});
		} else {
			res.status(401);
			throw new Error('Incorrect password');
		}
	} else {
		res.status(404);
		throw new Error('User does not exist, check email');
	}
});

const register = asyncHandler(async (req, res) => {
	const { confirmationURL } = req.body;

	const user = await User.findOne({ confirmationURL });

	if (user && !user.isConfirmed) {
		user.isConfirmed = true;
		await user.save();
		res.json({
			name: user.name,
			email: user.email,
			country: user.country,
			cart: user.cart,
			token: jwt.sign({ id: user._id }, process.env.JWT_KEY, {
				expiresIn: '1d',
			}),
		});
	} else {
		res.status(500);
		throw new Error(
			'An Error occurred, contact customer support if you cannot Sign In.'
		);
	}
});

const confirmation = asyncHandler(async (req, res) => {
	const { name, email, password, country } = req.body;

	const user = await User.findOne({ email });
	if (user && user.isConfirmed) {
		res.status(400);
		throw new Error('Email already exists');
	}
	if (user && !user.isConfirmed) {
		res.json({
			awaitingConfirmation: true,
			reSend: true,
			email: user.email,
		});
	} else {
		const user = await User.create({
			name,
			email,
			password,
			country,
			confirmationURL: 'n/a',
			admin: false,
		});

		if (user) {
			user.confirmationURL =
				crypto.randomBytes(20).toString('hex') + user._id;
			await user.save();
			await sendEmail({
				to: user.email,
				URL: user.confirmationURL,
			});
			res.json({
				awaitingConfirmation: true,
			});
		} else {
			res.status(400);
			throw new Error('Invalid Data, try again');
		}
	}
});

const reconfirmation = asyncHandler(async (req, res) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (user) {
		user.confirmationURL =
			crypto.randomBytes(20).toString('hex') + user._id;
		await user.save();
		await sendEmail({
			to: user.email,
			URL: user.confirmationURL,
		});
		res.json({
			awaitingConfirmation: true,
		});
	} else {
		res.status(400);
		throw new Error('Invalid Data, try again');
	}
});

router.route('/auth').post(login).put(register);
router.route('/confirm').put(confirmation).post(reconfirmation);

export default router;
