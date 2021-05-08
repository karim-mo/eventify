import mongoose from 'mongoose';

const ticketSchema = mongoose.Schema(
	{
		userID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		eventID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Event',
		},
		eventName: {
			type: String,
			required: true,
		},
		orderID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Order',
		},
		URL: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
