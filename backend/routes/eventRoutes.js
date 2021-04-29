import express from 'express';
import asyncHandler from 'express-async-handler';
import Event from '../models/EventModel.js';

const router = express.Router();

const getEvents = asyncHandler(async (req, res) => {
	try {
		const events = await Event.find({});
		if (events) {
			res.json(events);
		} else {
			res.status(404);
			throw new Error('No events to show');
		}
	} catch (error) {
		res.status(500);
		throw new Error('Failed to retrieve events.');
	}
});

const getEvent = asyncHandler(async (req, res) => {
	try {
		const event = await Event.findById(req.params.id);
		if (event) {
			res.json(event);
		} else {
			res.status(404);
			throw new Error('Event not found');
		}
	} catch (error) {
		res.status(500);
		throw new Error('Failed to retrieve event.');
	}
});

router.route('/').get(getEvents);
router.route('/:id').get(getEvent);

export default router;
