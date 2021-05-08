import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';
import Order from '../models/OrderModel.js';
import Event from '../models/EventModel.js';
import PromoCode from '../models/PromoModel.js';
import Ticket from '../models/QRTicketModel.js';
import { protect, admin, ticketer } from '../middleware/auth.js';
import colors from 'colors';

const router = express.Router();

const getPublicTicketDetails = asyncHandler(async (req, res) => {
	const ticketID = req.params.id;
	const ticket = await Ticket.findById(ticketID);
	if (ticket) {
		const user = await User.findById(ticket.userID);
		const event = await Event.findById(ticket.eventID);
		if (
			req.user.eventID &&
			req.user.eventID.toString() === ticket.eventID.toString()
		) {
			res.json({
				owner: user.name,
				owner_email: user.email,
				owner_id: user._id,
				ticket_id: ticket._id,
				event_name: event.name,
				event_id: event._id,
				seen: ticket.seen,
			});
		} else {
			res.status(401);
			throw new Error('You are not a ticketer for this event.');
		}
	} else {
		res.status(404);
		throw new Error('Ticket not found');
	}
});

const markTicketAsSeen = asyncHandler(async (req, res) => {
	const ticketID = req.params.id;
	const ticket = await Ticket.findById(ticketID);
	if (ticket) {
		const user = await User.findById(ticket.userID);
		const event = await Event.findById(ticket.eventID);
		if (
			req.user.eventID &&
			req.user.eventID.toString() === ticket.eventID.toString()
		) {
			if (ticket.seen) {
				res.status(400);
				throw new Error('Ticket is already seen');
			}
			ticket.seen = true;
			await ticket.save();
			res.json({
				owner: user.name,
				owner_email: user.email,
				owner_id: user._id,
				ticket_id: ticket._id,
				event_name: event.name,
				event_id: event._id,
				seen: ticket.seen,
			});
		} else {
			res.status(401);
			throw new Error('You are not a ticketer for this event.');
		}
	} else {
		res.status(404);
		throw new Error('Ticket not found');
	}
});

const getTicketDetails = asyncHandler(async (req, res) => {
	const ticketID = req.params.id;
	const ticket = await Ticket.findById(ticketID);
	if (ticket) {
		if (ticket.userID.toString() === req.user._id.toString()) {
			const user = await User.findById(ticket.userID);
			const event = await Event.findById(ticket.eventID);
			res.json({
				owner: user.name,
				owner_email: user.email,
				owner_id: user._id,
				ticket_id: ticket._id,
				event_name: event.name,
				URL: ticket.URL,
			});
		} else {
			res.status(401);
			throw new Error('Cannot view ticket.');
		}
	} else {
		res.status(404);
		throw new Error('Ticket not found');
	}
});

const getUserTickets = asyncHandler(async (req, res) => {
	const user = req.user;
	const ticketsPerPage = 10;
	const pageNo = Number(req.query.pageNo) || 1;

	const ticketsCount = await Ticket.countDocuments({ userID: user._id });
	if (ticketsCount) {
		const pages = Math.ceil(ticketsCount / ticketsPerPage);
		if (pages < pageNo) {
			res.status(400);
			throw new Error('No tickets to show.');
		}
		const tickets = await Ticket.find({ userID: user._id })
			.limit(ticketsPerPage)
			.skip(ticketsPerPage * (pageNo - 1))
			.sort({ createdAt: -1 });

		res.json({ tickets, pages });
	} else {
		res.status(404);
		throw new Error('No tickets to show.');
	}
});

router.route('/usertickets').get(protect, getUserTickets);
router
	.route('/:id')
	.get(protect, ticketer, getPublicTicketDetails)
	.put(protect, ticketer, markTicketAsSeen)
	.post(protect, getTicketDetails);

export default router;
