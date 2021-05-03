import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/auth.js';
import User from '../models/UserModel.js';
import Event from '../models/EventModel.js';
import Order from '../models/OrderModel.js';

const router = express.Router();

const getUserCart = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	if (user) {
		res.json({ cart: user.cart });
	} else {
		res.status(404);
		throw new Error('Error retrieving user');
	}
});

const addToUserCart = asyncHandler(async (req, res) => {
	const user = req.user;
	const userOrders = await Order.find({ userID: user._id });
	if (userOrders.length > 0) {
		userOrders.forEach((order) => {
			if (order.paymentDetails.status !== 'COMPLETED') {
				res.status(400);
				throw new Error(
					'Please pay your pending orders before creating a new one'
				);
			}
		});
	}
	const { eventID } = req.body;
	if (eventID) {
		const event = await Event.findById(eventID);
		if (event) {
			const newTicket = {
				name: event.name,
				ticketPrice: event.ticketPrice,
				eventID: eventID,
			};
			if (user) {
				const ticketExists = user.cart.find(
					(cartItem) =>
						cartItem.eventID.toString() === eventID.toString()
				);
				if (ticketExists) {
					res.status(400);
					throw new Error('Ticket already exists in cart');
				}
				user.cart.push(newTicket);
				await user.save();
				res.json({ cart: user.cart });
			} else {
				res.status(404);
				throw new Error('Error retrieving user');
			}
		} else {
			res.status(404);
			throw new Error('Error retrieving event');
		}
	} else {
		res.status(500);
		throw new Error('Request failed.');
	}
});

const removeFromUserCart = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	const { eventID } = req.body;
	if (eventID) {
		const event = await Event.findById(eventID);
		if (event) {
			if (user) {
				const ticketExists = user.cart.find(
					(ticket) => ticket.eventID.toString() === eventID.toString()
				);
				if (!ticketExists) {
					res.status(404);
					throw new Error('Ticket does not exist');
				}
				user.cart = user.cart.filter(
					(ticket) => ticket.eventID.toString() !== eventID.toString()
				);
				await user.save();
				res.json({ cart: user.cart });
			} else {
				res.status(404);
				throw new Error('Error retrieving user');
			}
		} else {
			res.status(404);
			throw new Error('Error retrieving event');
		}
	} else {
		res.status(500);
		throw new Error('Request failed.');
	}
});

router
	.route('/')
	.get(protect, getUserCart)
	.put(protect, addToUserCart)
	.delete(protect, removeFromUserCart);

export default router;
