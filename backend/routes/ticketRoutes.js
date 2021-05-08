import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';
import Order from '../models/OrderModel.js';
import Event from '../models/EventModel.js';
import PromoCode from '../models/PromoModel.js';
import Ticket from '../models/QRTicketModel.js';
import { protect, admin } from '../middleware/auth.js';
import colors from 'colors';

const router = express.Router();

const getPublicTicketDetails = asyncHandler(async (req, res) => {
	try {
	} catch (error) {}
});

const getUserTickets = asyncHandler(async (req, res) => {
	const user = req.user;
	const ticketsPerPage = 1;
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
router.route('/:id').get(getPublicTicketDetails);

export default router;
