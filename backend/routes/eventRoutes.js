import express from 'express';
import asyncHandler from 'express-async-handler';
import { admin, protect } from '../middleware/auth.js';
import Event from '../models/EventModel.js';
import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const getEvents = asyncHandler(async (req, res) => {
	const eventsPerPage = 10;
	const pageNo = Number(req.query.pageNo) || 1;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			const token = req.headers.authorization.split(' ')[1];

			const decoded = jwt.verify(token, process.env.JWT_KEY);

			const user = await User.findById(decoded.id);

			const eventCount = await Event.countDocuments({
				$or: [
					{ eventCountry: { $elemMatch: { countryCode: user.country } } },
					{ eventCountry: { $elemMatch: { countryCode: 'GLOBAL' } } },
				],
			});
			if (eventCount) {
				const pages = Math.ceil(eventCount / eventsPerPage);
				if (pages < pageNo) {
					throw new Error('No events to show');
				}

				const events = await Event.find({
					$or: [
						{ eventCountry: { $elemMatch: { countryCode: user.country } } },
						{ eventCountry: { $elemMatch: { countryCode: 'GLOBAL' } } },
					],
				})
					.limit(eventsPerPage)
					.skip(eventsPerPage * (pageNo - 1));

				res.json({ events, pages });
			} else {
				throw new Error('No events to show');
			}
		} catch (error) {
			if (error.message.startsWith('No')) {
				res.status(404);
				throw new Error(error.message);
			}
			res.status(401);
			throw new Error('Not authorized, token failed');
		}
	} else {
		const eventCount = await Event.countDocuments({});
		if (eventCount) {
			const pages = Math.ceil(eventCount / eventsPerPage);
			if (pages < pageNo) {
				res.status(404);
				throw new Error('No events to show');
			}
			const events = await Event.find({})
				.limit(eventsPerPage)
				.skip(eventsPerPage * (pageNo - 1));

			res.json({ events, pages });
		} else {
			res.status(404);
			throw new Error('No events to show');
		}
	}
});

const addUserComment = asyncHandler(async (req, res) => {
	const user = req.user;
	const { comment } = req.body;
	if (comment && comment.length > 0 && comment.length <= 200) {
		const newComment = {
			user: user.name,
			userID: user._id,
			comment: comment,
			hearts: 0,
		};
		const event = await Event.findById(req.params.id);
		if (event) {
			if (
				!event.joinedUsers.find((joinedUser) => joinedUser.userID.toString() === user._id.toString())
			) {
				res.status(401);
				throw new Error('Cannot react to a comment for an event you are not joined.');
			}
			event.comments.push(newComment);
			await event.save();
			res.json(event);
		} else {
			res.status(404);
			throw new Error('Event not found');
		}
	} else {
		res.status(400);
		throw new Error('Invalid Comment');
	}
});

const toggleCommentHeart = asyncHandler(async (req, res) => {
	const user = req.user;
	const { commentID } = req.body;
	const event = await Event.findById(req.params.id);
	if (event) {
		if (!event.joinedUsers.find((joinedUser) => joinedUser.userID.toString() === user._id.toString())) {
			res.status(401);
			throw new Error('Cannot react to a comment for an event you are not joined.');
		}
		const _comment = event.comments.find((comment) => comment._id.toString() === commentID.toString());
		if (_comment) {
			let hearted = false;
			_comment.heartedBy.forEach((_user, index) => {
				if (_user.userID.toString() === user._id.toString()) {
					_comment.heartedBy.splice(index);
					_comment.hearts -= 1;
					hearted = true;
				}
			});
			if (!hearted) {
				_comment.hearts += 1;
				const newHeartUser = {
					userID: user._id,
				};
				_comment.heartedBy.push(newHeartUser);
			}
			event.comments.map((comment) => {
				if (comment._id.toString() === commentID.toString()) {
					return _comment;
				}
				return comment;
			});
			await event.save();
			res.json(event);
		} else {
			res.status(404);
			throw new Error('Comment not found.');
		}
	} else {
		res.status(404);
		throw new Error('Event not found');
	}
});

const getEvent = asyncHandler(async (req, res) => {
	const event = await Event.findById(req.params.id);
	if (event) {
		if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
			try {
				const token = req.headers.authorization.split(' ')[1];

				const decoded = jwt.verify(token, process.env.JWT_KEY);

				const user = await User.findById(decoded.id);

				if (
					!event.eventCountry.find(
						(cc) => cc.countryCode === user.country || cc.countryCode === 'GLOBAL'
					)
				) {
					throw new Error('User unauthorized');
				}

				res.json(event);
			} catch (error) {
				res.status(401);
				throw new Error('Not authorized');
			}
		} else {
			res.json(event);
		}
	} else {
		res.status(404);
		throw new Error('Event not found');
	}
});

const getUserHostedEvents = asyncHandler(async (req, res) => {
	const eventsPerPage = 10;
	const pageNo = Number(req.query.pageNo) || 1;

	const eventsCount = await Event.countDocuments({ authorID: req.user._id });
	if (eventsCount) {
		const pages = Math.ceil(eventsCount / eventsPerPage);
		if (pages > pageNo) {
			res.status(404);
			throw new Error('No events to show');
		}

		const events = await Event.find({ authorID: req.user._id })
			.limit(eventsPerPage)
			.skip(eventsPerPage * (pageNo - 1))
			.sort({ createdAt: -1 });

		res.json({ events, pages });
	} else {
		res.status(404);
		throw new Error('No events to show');
	}
});

const deleteEventByID = asyncHandler(async (req, res) => {
	const event = await Event.findById(req.params.id);
	if (event) {
		await Event.deleteOne({ _id: event._id });
		res.json({});
	} else {
		res.status(404);
		throw new Error('No events to delete');
	}
});

const addNewEvent = asyncHandler(async (req, res) => {
	const {
		virtual,
		authorEmail,
		name,
		image,
		description,
		category,
		ticketPrice,
		availableTickets,
		eventCountry,
		endsOnYear,
		endsOnMonth,
		endsOnDay,
	} = req.body;

	const user = await User.findOne({ email: authorEmail });
	if (user) {
		const newEvent = {
			virtual,
			authorID: user._id,
			author: user.name,
			adminID: req.user._id,
			name,
			image,
			description,
			category,
			ticketPrice: Number(ticketPrice),
			availableTickets: Math.ceil(Number(availableTickets)),
			eventCountry,
			endsOn: {
				day: endsOnDay,
				month: endsOnMonth,
				year: endsOnYear,
			},
		};

		const created = await Event.create(newEvent);
		if (created) {
			res.json({ id: created._id });
		} else {
			res.status(400);
			throw new Error('Failed to create event');
		}
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

const editEventByID = asyncHandler(async (req, res) => {
	const {
		eventID,
		name,
		image,
		description,
		category,
		ticketPrice,
		availableTickets,
		eventCountry,
		endsOnYear,
		endsOnMonth,
		endsOnDay,
	} = req.body;

	const event = await Event.findById(eventID);
	if (event) {
		event.name = name || event.name;
		event.image = image || event.image;
		event.description = description || event.description;
		event.category = category || event.category;
		event.ticketPrice = Number(ticketPrice) || event.ticketPrice;
		event.availableTickets = Math.ceil(Number(availableTickets)) || event.availableTickets;
		event.eventCountry = eventCountry || event.eventCountry;
		event.endsOn = {
			year: Number(endsOnYear) || event.endsOn.year,
			month: Number(endsOnMonth) || event.endsOn.month,
			day: Number(endsOnDay) || event.endsOn.day,
		};

		await event.save();
		res.json(event);
	} else {
		res.status(404);
		throw new Error('Event not found');
	}
});

router.route('/').get(getEvents).put(protect, admin, addNewEvent).post(protect, admin, editEventByID);
router.route('/userevents').get(protect, getUserHostedEvents);
router
	.route('/:id')
	.get(getEvent)
	.put(protect, addUserComment)
	.post(protect, toggleCommentHeart)
	.delete(protect, admin, deleteEventByID);

export default router;
