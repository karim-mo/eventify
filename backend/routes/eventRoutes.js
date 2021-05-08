import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/auth.js';
import Event from '../models/EventModel.js';

const router = express.Router();

const getEvents = asyncHandler(async (req, res) => {
	const eventsPerPage = 6;
	const pageNo = Number(req.query.pageNo) || 1;

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
});

const getEvent = asyncHandler(async (req, res) => {
	const event = await Event.findById(req.params.id);
	if (event) {
		res.json(event);
	} else {
		res.status(404);
		throw new Error('Event not found');
	}
});

const getUserHostedEvents = asyncHandler(async (req, res) => {
	console.log('here0');
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

router.route('/').get(getEvents);
router.route('/userevents').get(protect, getUserHostedEvents);
router.route('/:id').get(getEvent);

export default router;
