import mongoose from 'mongoose';

const cartSchema = mongoose.Schema(
	{
		name: { type: String, required: true },
		ticketPrice: { type: Number, required: true },
		eventID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Event',
		},
	},
	{
		timestamps: true,
	}
);

const orderSchema = mongoose.Schema(
	{
		userID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		orderItems: [cartSchema],
		paymentMethod: {
			type: String,
			required: true,
		},
		paymentDetails: {
			paymentID: { type: String },
			paymentMethod: { type: String },
			status: { type: String },
			payeer: { type: String },
			payer: { type: String },
			email_address: { type: String },
		},
		promoCode: {
			type: String,
			default: 'n/a',
		},
		itemsPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		fees: {
			type: Number,
			required: true,
			default: 0.0,
		},
		totalPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
	},
	{
		timestamps: true,
	}
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
