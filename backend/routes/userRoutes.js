import express from 'express';
import asyncHandler from 'express-async-handler';
import { admin, protect } from '../middleware/auth.js';
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
				joinedOn: user.createdAt,
				id: user._id,
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
			joinedOn: user.createdAt,
			id: user._id,
			token: jwt.sign({ id: user._id }, process.env.JWT_KEY, {
				expiresIn: '1d',
			}),
		});
	} else {
		res.status(500);
		throw new Error('An Error occurred, contact customer support if you cannot Sign In.');
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
			user.confirmationURL = crypto.randomBytes(20).toString('hex') + user._id;
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
		user.confirmationURL = crypto.randomBytes(20).toString('hex') + user._id;
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

const allowAdmin = asyncHandler(async (req, res) => {
	res.json({});
});

const getUsers = asyncHandler(async (req, res) => {
	const usersPerPage = 10;
	const pageNo = Number(req.query.pageNo) || 1;

	const usersCount = await User.countDocuments({});
	if (usersCount) {
		const pages = Math.ceil(usersCount / usersPerPage);
		if (pages < pageNo) {
			res.status(400);
			throw new Error('No users to show');
		}
		const users = await User.find({})
			.limit(usersPerPage)
			.skip(usersPerPage * (pageNo - 1))
			.sort({ createdAt: -1 });

		res.json({ users, pages });
	} else {
		res.status(404);
		throw new Error('No users to show');
	}
});

const deleteUserByID = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (user && !user.admin) {
		await User.deleteOne({ _id: user._id });
		res.json({});
	} else {
		res.status(404);
		throw new Error('No users to delete');
	}
});

const createTicketer = asyncHandler(async (req, res) => {
	const { eventID } = req.body;
	const event = await Event.findById(eventID);
	if (event) {
		const ticketerHEX = crypto.randomBytes(20).toString('hex');
		const ticketer = await User.create({
			name: `Ticketer ${ticketerHEX.slice(0, 5)}`,
			email: `${ticketerHEX}@eventify.co`,
			password: `eventify`,
			country: 'N/A',
			confirmationURL: 'n/a',
			admin: false,
			ticketer: true,
			isConfirmed: true,
			eventID: event._id,
		});
		ticketer.email = `${ticketer._id}@eventify.co`;
		await ticketer.save();
		res.json({});
	} else {
		res.status(404);
		throw new Error('Event not found');
	}
});

router.route('/').get(protect, admin, getUsers).put(protect, admin, createTicketer);
router.route('/auth').post(login).put(register);
router.route('/confirm').put(confirmation).post(reconfirmation);
router.route('/checkadmin').post(protect, admin, allowAdmin);
router.route('/:id').delete(protect, admin, deleteUserByID);

export default router;
