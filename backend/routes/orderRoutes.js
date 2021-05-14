import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';
import Order from '../models/OrderModel.js';
import Event from '../models/EventModel.js';
import PromoCode from '../models/PromoModel.js';
import Ticket from '../models/QRTicketModel.js';
import { protect, admin } from '../middleware/auth.js';
import request from 'request';
import crypto from 'crypto';
import colors from 'colors';

const router = express.Router();

const editEventTickets = async (orderID) => {
	try {
		const order = await Order.findById(orderID);
		const today = new Date();
		let updatedOrderItems = await Promise.all(
			order.orderItems.map(async (ticket) => {
				const event = await Event.findById(ticket.eventID);
				const date = new Date(
					event.endsOn.year,
					event.endsOn.month - 1,
					event.endsOn.day + 1
				);
				if (today >= date || event.availableTickets <= 0) {
					return;
				}
				return ticket;
			})
		);
		updatedOrderItems = updatedOrderItems.filter((ticket) => ticket);
		if (updatedOrderItems.length < order.orderItems.length) {
			return false;
		}

		for (const ticket of order.orderItems) {
			const _event = await Event.findById(ticket.eventID);
			_event.availableTickets -= 1;
			await _event.save();
		}

		return true;
	} catch (e) {
		console.error(e.message);
	}
};

const revertEventTickets = async (orderID) => {
	try {
		const order = await Order.findById(orderID);

		for (const ticket of order.orderItems) {
			const _event = await Event.findById(ticket.eventID);
			_event.availableTickets += 1;
			await _event.save();
		}
	} catch (e) {
		console.error(e.message);
	}
};

const buyTicketsForOrder = async (orderID) => {
	try {
		const order = await Order.findById(orderID);
		if (order) {
			if (order.orderItems.length > 0) {
				for (const ticket of order.orderItems) {
					const event = await Event.findById(ticket.eventID);
					if (event) {
						const newTicket = await Ticket.create({
							orderID: orderID,
							userID: order.userID,
							eventID: ticket.eventID,
							eventName: event.name,
							URL: 'N/A',
						});
						const URL = `https://eventify-global.herokuapp.com/tickets/${newTicket._id}`;
						newTicket.URL = URL;
						await newTicket.save();

						const user = await User.findById(order.userID);
						if (user) {
							const newJoinedUser = {
								user: user.name,
								userID: user._id,
							};
							event.joinedUsers.push(newJoinedUser);
							await event.save();
						} else {
							throw new Error(
								'BuyTicketsForOrder(): Couldnt get user from ticket'
							);
						}
					} else {
						throw new Error(
							'BuyTicketsForOrder(): Couldnt get event'
						);
					}
				}
			} else {
				throw new Error('BuyTicketsForOrder(): Order Items are empty');
			}
		} else {
			throw new Error('BuyTicketsForOrder(): Couldnt find order');
		}
	} catch (e) {
		console.error(e.message);
	}
};

const getUserOrders = asyncHandler(async (req, res) => {
	const ordersPerPage = 12;
	const pageNo = Number(req.query.pageNo) || 1;

	const userOrdersCount = await Order.countDocuments({
		userID: req.user._id,
	});

	if (userOrdersCount) {
		const pages = Math.ceil(userOrdersCount / ordersPerPage);
		if (pages < pageNo) {
			res.status(404);
			throw new Error('No orders to show');
		}
		const userOrders = await Order.find({ userID: req.user._id })
			.limit(ordersPerPage)
			.skip(ordersPerPage * (pageNo - 1))
			.sort({ createdAt: -1 });

		res.json({ userOrders, pages });
	} else {
		res.status(404);
		throw new Error(`You don't have any orders.`);
	}
});

const createOrder = asyncHandler(async (req, res) => {
	const cart = req.user.cart;
	if (cart.length > 0) {
		const today = new Date();
		let updatedCart = await Promise.all(
			cart.map(async (ticket) => {
				const event = await Event.findById(ticket.eventID);
				const date = new Date(
					event.endsOn.year,
					event.endsOn.month - 1,
					event.endsOn.day + 1
				);
				if (today >= date) {
					return;
				}
				return ticket;
			})
		);
		updatedCart = updatedCart.filter((ticket) => ticket);
		req.user.cart = updatedCart;
		await req.user.save();
		if (updatedCart.length <= 0) {
			res.status(400);
			throw new Error(
				'Cart has been cleared of expired items and is now empty, cannot proceed.'
			);
		}

		const itemsPrice = cart
			.reduce((acc, ticket) => acc + ticket.ticketPrice, 0)
			.toFixed(2);
		const fees = cart
			.reduce((acc, ticket) => acc + 0.05 * ticket.ticketPrice, 0)
			.toFixed(2);
		const totalPrice = cart
			.reduce((acc, ticket) => acc + 1.05 * ticket.ticketPrice, 0)
			.toFixed(2);
		const order = await Order.create({
			userID: req.user._id,
			orderItems: updatedCart,
			paymentMethod: 'paypal',
			paymentDetails: {
				status: 'PENDING',
			},
			itemsPrice,
			fees,
			totalPrice,
		});

		request.post(
			'https://api-m.sandbox.paypal.com/v2/checkout/orders',
			{
				auth: {
					user: process.env.CLIENT_ID,
					pass: process.env.CLIENT_PW,
				},
				body: {
					intent: 'CAPTURE',
					purchase_units: [
						{
							amount: {
								value: totalPrice.toString(),
								currency_code: 'USD',
							},
						},
					],
				},
				json: true,
			},
			asyncHandler(async (err, response) => {
				if (err) {
					res.status(500);
					const err = new Error(
						'Failed to create order, try again later.'
					);
					res.json({
						message: err.message,
						stack:
							process.env.DEV_MODE === 'production'
								? null
								: err.stack,
					});
					return;
				}
				order.paymentDetails = {
					...order.paymentDetails,
					paymentID: response.body.id,
				};
				await order.save();
				req.user.cart = [];
				await req.user.save();
				res.json({
					orderID: order._id,
				});
			})
		);
	} else {
		res.status(400);
		throw new Error('Cart is empty, cannot create order.');
	}
});

const getPaypalOrder = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);
	if (order) {
		request.get(
			`https://api-m.sandbox.paypal.com/v2/checkout/orders/${order.paymentDetails.paymentID}`,
			{
				auth: {
					user: process.env.CLIENT_ID,
					pass: process.env.CLIENT_PW,
				},
				json: true,
			},
			asyncHandler(async (err, response) => {
				if (err) {
					res.status(500);
					const err = new Error('An unknown error occurred.');
					res.json({
						message: err.message,
						stack:
							process.env.DEV_MODE === 'production'
								? null
								: err.stack,
					});
					return;
				}
				if (
					response.body.name &&
					response.body.name === 'RESOURCE_NOT_FOUND'
				) {
					res.status(401);
					const err = new Error(
						'Payment ID could not be retrieved, please refresh the page or contact customer support'
					);
					res.json({
						message: err.message,
						stack:
							process.env.DEV_MODE === 'production'
								? null
								: err.stack,
					});
					return;
				}
				res.json({
					paymentID: response.body.id,
				});
			})
		);
	} else {
		res.status(404);
		throw new Error(
			'Order not found, try again or contact customer support.'
		);
	}
});

const confirmOrder = asyncHandler(async (req, res) => {
	const { orderID } = req.body;
	const order = await Order.findById(orderID);
	if (order) {
		request.get(
			`https://api-m.sandbox.paypal.com/v2/checkout/orders/${order.paymentDetails.paymentID}`,
			{
				auth: {
					user: process.env.CLIENT_ID,
					pass: process.env.CLIENT_PW,
				},
				json: true,
			},
			asyncHandler(async (err, response) => {
				if (err) {
					res.status(500);
					const err = new Error('An unknown error occurred.');
					res.json({
						message: err.message,
						stack:
							process.env.DEV_MODE === 'production'
								? null
								: err.stack,
					});
					return;
				}
				if (
					response.body.name &&
					response.body.name === 'RESOURCE_NOT_FOUND'
				) {
					res.status(400);
					const err = new Error(
						'Error processing your payment, please contact customer support.'
					);
					order.paymentDetails.status = 'CANCELLED';
					await order.save();
					res.json({
						message: err.message,
						stack:
							process.env.DEV_MODE === 'production'
								? null
								: err.stack,
					});
					return;
				} else {
					if (
						response.body.status &&
						response.body.status === 'APPROVED' &&
						order.paymentDetails.status !== 'CANCELLED'
					) {
						const canPurchase = await editEventTickets(order._id);
						if (canPurchase) {
							request.post(
								`https://api-m.sandbox.paypal.com/v2/checkout/orders/${order.paymentDetails.paymentID}/capture`,
								{
									headers: {
										'Content-Type': 'application/json',
									},
									auth: {
										user: process.env.CLIENT_ID,
										pass: process.env.CLIENT_PW,
									},

									json: true,
								},
								asyncHandler(async (err, response) => {
									if (err) {
										res.status(500);
										const err = new Error(
											'Failed to process payment, contact customer support'
										);
										await revertEventTickets(order._id);
										res.json({
											message: err.message,
											stack:
												process.env.DEV_MODE ===
												'production'
													? null
													: err.stack,
										});
										return;
									}
									if (
										response.body.status &&
										response.body.status === 'COMPLETED'
									) {
										order.paymentDetails = {
											...order.paymentDetails,
											status: response.body.status,
											email_address:
												response.body.payer
													.email_address,
											payer: `${response.body.payer.name.given_name} ${response.body.payer.name.surname}`,
										};
										await order.save();
										await buyTicketsForOrder(order._id);
										res.json({});
										//Handle buying the tickets for the user.
										return;
									} else {
										// A very unlikely condition to happen.
										const err = new Error(
											'Failed to process payment, contact customer support'
										);
										console.log(`${err.message}`.red.bold);
										order.paymentDetails.status =
											'CANCELLED';
										await order.save();
										await revertEventTickets(order._id);
										res.status(500);
										res.json({
											message: err.message,
											stack:
												process.env.DEV_MODE ===
												'production'
													? null
													: err.stack,
										});
										return;
									}
								})
							);
						} else {
							res.status(400);
							const err = new Error(
								'Cannot complete purchase, one or more events have ran out of tickets, Your Paypal account was not charged.'
							);
							order.paymentDetails.status = 'CANCELLED';
							await order.save();
							res.json({
								message: err.message,
								stack:
									process.env.DEV_MODE === 'production'
										? null
										: err.stack,
							});
							return;
						}
					}
				}
			})
		);
	} else {
		res.status(404);
		throw new Error(
			'Error retrieving order, please contact customer support'
		);
	}
});

const getOrders = asyncHandler(async (req, res) => {
	try {
	} catch (error) {}
});

const getOrderByID = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);
	const { capture } = req.body;
	if (
		order &&
		(req.user._id.toString() === order.userID.toString() || req.user.admin)
	) {
		request.get(
			`https://api-m.sandbox.paypal.com/v2/checkout/orders/${order.paymentDetails.paymentID}`,
			{
				auth: {
					user: process.env.CLIENT_ID,
					pass: process.env.CLIENT_PW,
				},
				json: true,
			},
			asyncHandler(async (err, response) => {
				if (err) {
					res.status(500);
					const err = new Error('An unknown error occurred.');
					res.json({
						message: err.message,
						stack:
							process.env.DEV_MODE === 'production'
								? null
								: err.stack,
					});
					return;
				}
				if (
					response.body.name &&
					response.body.name === 'RESOURCE_NOT_FOUND' &&
					order.paymentDetails.status !== 'COMPLETED' &&
					order.paymentDetails.status !== 'APPROVED'
				) {
					request.post(
						'https://api-m.sandbox.paypal.com/v2/checkout/orders',
						{
							auth: {
								user: process.env.CLIENT_ID,
								pass: process.env.CLIENT_PW,
							},
							body: {
								intent: 'CAPTURE',
								purchase_units: [
									{
										amount: {
											value: order.totalPrice.toString(),
											currency_code: 'USD',
										},
									},
								],
							},
							json: true,
						},
						asyncHandler(async (err, response) => {
							if (err) {
								res.status(500);
								const err = new Error(
									'Failed to create order, try again later.'
								);
								res.json({
									message: err.message,
									stack:
										process.env.DEV_MODE === 'production'
											? null
											: err.stack,
								});
								return;
							}
							order.paymentDetails = {
								...order.paymentDetails,
								paymentID: response.body.id,
							};
							await order.save();
							res.json({
								id: order._id,
								name: req.user.name,
								email: req.user.email,
								paymentDetails: order.paymentDetails,
								paymentMethod: order.paymentMethod,
								itemsPrice: order.itemsPrice,
								fees: order.fees,
								totalPrice: order.totalPrice,
								promoCode: order.promoCode,
								orderItems: order.orderItems,
							});
							return;
						})
					);
				} else {
					if (
						response.body.status === 'APPROVED' &&
						order.paymentDetails.status !== 'APPROVED' &&
						order.paymentDetails.status !== 'CANCELLED'
					) {
						order.paymentDetails.status = 'APPROVED';
						await order.save();
					}
					res.json({
						id: order._id,
						name: req.user.name,
						email: req.user.email,
						paymentDetails: order.paymentDetails,
						paymentMethod: order.paymentMethod,
						itemsPrice: order.itemsPrice,
						fees: order.fees,
						totalPrice: order.totalPrice,
						promoCode: order.promoCode,
						orderItems: order.orderItems,
					});
					if (
						response.body.status &&
						response.body.status === 'APPROVED' &&
						capture &&
						order.paymentDetails.status !== 'CANCELLED'
					) {
						// Capture it after updating client to be ready for next page refresh
						const canPurchase = await editEventTickets(order._id);
						if (canPurchase) {
							request.post(
								`https://api-m.sandbox.paypal.com/v2/checkout/orders/${order.paymentDetails.paymentID}/capture`,
								{
									headers: {
										'Content-Type': 'application/json',
									},
									auth: {
										user: process.env.CLIENT_ID,
										pass: process.env.CLIENT_PW,
									},

									json: true,
								},
								asyncHandler(async (err, response) => {
									if (err) {
										const err = new Error(
											'Failed to process payment, contact customer support'
										);
										await revertEventTickets(order._id);
										console.log(`${err.message}`.red.bold);
										return;
									}
									if (
										response.body.status &&
										response.body.status === 'COMPLETED'
									) {
										order.paymentDetails = {
											...order.paymentDetails,
											status: response.body.status,
											email_address:
												response.body.payer
													.email_address,
											payer: `${response.body.payer.given_name} ${response.body.payer.surname}`,
										};
										await order.save();
										await buyTicketsForOrder(order._id);

										//Handle buying the tickets for the user.
									} else {
										// A very unlikely condition to happen.
										const err = new Error(
											'Failed to process payment, contact customer support'
										);
										console.log(`${err.message}`.red.bold);
										order.paymentDetails.status =
											'CANCELLED';
										await order.save();
										await revertEventTickets(order._id);
										return;
									}
								})
							);
						} else {
							res.status(400);
							const err = new Error(
								'Cannot complete purchase, one or more events have ran out of tickets, Your Paypal account was not charged.'
							);
							order.paymentDetails.status = 'CANCELLED';
							await order.save();
							return;
						}
					}
				}
			})
		);
	} else {
		res.status(404);
		throw new Error('Unable to retrieve order.');
	}
});

const applyPromo = asyncHandler(async (req, res) => {
	const { promo } = req.body;
	const order = await Order.findById(req.params.id);
	if (order) {
		const promoExists = await PromoCode.findOne({ code: promo });
		if (promoExists) {
			const discount = promoExists.discount;
			const totalPriceUpdated = order.totalPrice * (1 - discount);
			order.totalPrice = totalPriceUpdated.toFixed(2);
			order.promoCode = promoExists.code;
			await order.save();
			request.post(
				'https://api-m.sandbox.paypal.com/v2/checkout/orders',
				{
					auth: {
						user: process.env.CLIENT_ID,
						pass: process.env.CLIENT_PW,
					},
					body: {
						intent: 'CAPTURE',
						purchase_units: [
							{
								amount: {
									value: order.totalPrice.toString(),
									currency_code: 'USD',
								},
							},
						],
					},
					json: true,
				},
				asyncHandler(async (err, response) => {
					if (err) {
						res.status(500);
						const err = new Error(
							'Failed to create order, try again later.'
						);
						res.json({
							message: err.message,
							stack:
								process.env.DEV_MODE === 'production'
									? null
									: err.stack,
						});
						return;
					}
					order.paymentDetails = {
						...order.paymentDetails,
						paymentID: response.body.id,
					};
					await order.save();
					res.json({
						id: order._id,
						name: req.user.name,
						email: req.user.email,
						itemsPrice: order.itemsPrice,
						fees: order.fees,
						paymentDetails: order.paymentDetails,
						paymentMethod: order.paymentMethod,
						totalPrice: order.totalPrice,
						oldPrice: order.totalPrice / (1 - discount),
						promoCode: order.promoCode,
						orderItems: order.orderItems,
					});
				})
			);
		} else {
			res.status(404);
			throw new Error(
				`Promo code doesn't exist or has expired, try another one.`
			);
		}
	} else {
		res.status(404);
		throw new Error('Order doesnt exist');
	}
});

const deleteOrderByID = asyncHandler(async (req, res) => {
	try {
	} catch (error) {}
});

const editOrderbyID = asyncHandler(async (req, res) => {
	try {
	} catch (error) {}
});

router
	.route('/userorders')
	.get(protect, getUserOrders)
	.put(protect, createOrder)
	.post(protect, confirmOrder);

router.route('/').get(protect, admin, getOrders);

router.route('/paypal/:id').get(protect, getPaypalOrder);

router.route('/:id/special').post(protect, getOrderByID);

router
	.route('/:id')
	.post(protect, applyPromo)
	.put(protect, admin, editOrderbyID)
	.delete(protect, admin, deleteOrderByID);

export default router;
