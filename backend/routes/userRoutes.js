import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/auth.js';
import User from '../models/UserModel.js';
import Event from '../models/EventModel.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
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
	const { name, email, password, country } = req.body;

	const emailExists = await User.findOne({ email });
	if (emailExists) {
		res.status(400);
		throw new Error('Email already exists');
	}

	const user = await User.create({
		name,
		email,
		password,
		country,
		admin: false,
	});

	if (user) {
		res.json({
			name,
			email,
			country,
			cart: user.cart,
			token: jwt.sign({ id: user._id }, process.env.JWT_KEY, {
				expiresIn: '1d',
			}),
		});
	} else {
		res.status(400);
		throw new Error('Invalid Data, try again');
	}
});

router.route('/auth').post(login).put(register);

export default router;
