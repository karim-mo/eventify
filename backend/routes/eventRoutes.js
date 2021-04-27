import express from 'express';
import events from '../data/events.js';
import asyncHandler from 'express-async-handler';
const router = express.Router();

const getEvents = asyncHandler(async (req, res) => {
	res.json(events);
});

router.route('/').get(getEvents);

export default router;
