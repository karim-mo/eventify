import express from 'express';
import asyncHandler from 'express-async-handler';
import { admin, protect } from '../middleware/auth.js';
import User from '../models/UserModel.js';
import Event from '../models/EventModel.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import postgresClient from '../utils/postgres.js';
import bcrypt from 'bcryptjs';
import { Users } from '../utils/db.js';

const router = express.Router();

const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const {
		rows: { [0]: user },
	} = await postgresClient.query(
		`SELECT * FROM users
        WHERE email = $1
        LIMIT 1`,
		[email]
	);

	if (user) {
		if (!user.isConfirmed) {
			res.status(401);
			throw new Error(
				'Email is not verified, please check your email to finish verification or try re-registering to re-send a verification to your email.'
			);
		}
		const checkPw = await bcrypt.compare(password, user.password);
		if (checkPw) {
			let cart = [];
			const { rows: cartItems } = await postgresClient.query(
				`SELECT ticket._id, ticket.name, ticket."ticketPrice", ticket."eventID", ticket."createdAt" FROM ticket
                JOIN "userCarts" AS cart
                ON ticket."userCartID" = cart._id
                WHERE "userID" = $1`,
				[user._id]
			);

			cartItems.forEach((item) => {
				console.log(item);
				const ticket = {
					name: item.name,
					ticketPrice: item.ticketPrice,
					eventID: item.eventID,
				};

				cart.push(ticket);
			});

			res.json({
				email: user.email,
				name: user.name,
				country: user.country,
				cart,
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

	let user = await Users.simpleFindOne('confirmationURL', confirmationURL);

	if (user && !user.isConfirmed) {
		user = await Users.update(['isConfirmed'], ['TRUE'], { single: ['_id'] }, [user._id]);
		let cart = [];
		const { rows: cartItems } = await postgresClient.query(
			`SELECT ticket._id, ticket.name, ticket."ticketPrice", ticket."eventID", ticket."createdAt" FROM ticket
                JOIN "userCarts" AS cart
                ON ticket."userCartID" = cart._id
                WHERE "userID" = $1`,
			[user._id]
		);

		cartItems.forEach((item) => {
			console.log(item);
			const ticket = {
				name: item.name,
				ticketPrice: item.ticketPrice,
				eventID: item.eventID,
			};

			cart.push(ticket);
		});
		res.json({
			name: user.name,
			email: user.email,
			country: user.country,
			cart,
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

	const user = await Users.simpleFindOne('email', email);

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
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const _user = await Users.create({
			name,
			email,
			password: hash,
			country,
		});

		if (_user) {
			const urlHash = crypto.randomBytes(20).toString('hex') + _user._id;
			await Users.update(['confirmationURL'], [urlHash], { single: ['_id'] }, [_user._id]);
			await sendEmail({
				to: _user.email,
				URL: urlHash,
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

	const user = await Users.simpleFindOne('email', email);

	if (user) {
		const urlHash = crypto.randomBytes(20).toString('hex') + user._id;
		await Users.update(['confirmationURL'], [urlHash], { single: ['_id'] }, [user._id]);
		await sendEmail({
			to: user.email,
			URL: urlHash,
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

const forgotPassword = asyncHandler(async (req, res) => {
	const { email } = req.body;
	const emailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
	if (!emailValid.test(email)) {
		res.status(400);
		throw new Error('Please use a valid email');
	}
	const user = await User.findOne({ email });
	if (user) {
		const passResetURL = crypto.randomBytes(20).toString('hex') + user._id;
		user.confirmationURL = passResetURL;
		await user.save();
		await sendEmail({
			to: email,
			subject: 'Eventify Password reset',
			text: `You requested a password reset at Eventify, if this wasn't you then we recommend you change your password immidiately.\nIf it was you, please proceed with this link http://localhost:3000/resetpw/${passResetURL}`,
		});
		res.json({});
	} else {
		res.status(400);
		throw new Error('Unknown error occurred');
	}
});

const resetPassword = asyncHandler(async (req, res) => {
	const { passResetURL, newPassword } = req.body;
	const user = await User.findOne({ confirmationURL: passResetURL });
	if (user) {
		user.confirmationURL = '';
		user.password = newPassword;
		await user.save();
		res.json({});
	} else {
		res.status(400);
		throw new Error('Unknown error occurred');
	}
});

const createEvent = asyncHandler(async (req, res) => {
	const { name, email, description } = req.body;
	const user = req.user;
	const body = `Event request from User: ${user._id}\nName: ${name}\nEmail: ${email}\nEvent description:\n${description}`;

	await sendEmail({
		to: 'eventify.tickets@gmail.com',
		subject: `New Event Request from ${user.email}`,
		text: body,
	});
	res.json({});
});

const support = asyncHandler(async (req, res) => {
	const { name, email, description } = req.body;
	const body = `Support ticket from User ${req.user._id}\nName: ${name}\nEmail: ${email}\nIssue:\n${description}`;

	await sendEmail({
		to: 'eventify.tickets@gmail.com',
		subject: `New Support ticket from ${email}`,
		text: body,
	});
	await sendEmail({
		to: email,
		subject: `Ticket received! We'll come back to you shortly`,
		text: `This is an automated reply to your recent support ticket, we are informing you that one of our support agents will handle your ticket as soon as possible.\nThank you for using Eventify.`,
	});
	res.json({});
});

router.route('/').get(protect, admin, getUsers).put(protect, admin, createTicketer);
router.route('/userpassword').post(forgotPassword).put(resetPassword);
router.route('/auth').post(login).put(register);
router.route('/confirm').put(confirmation).post(reconfirmation);
router.route('/checkadmin').post(protect, admin, allowAdmin);
router.route('/emails').post(protect, createEvent).put(protect, support);
router.route('/:id').delete(protect, admin, deleteUserByID);

export default router;
