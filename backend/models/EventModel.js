import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const eventCountrySchema = mongoose.Schema({
	countryName: { type: String, required: true },
	countryCode: { type: String, required: true },
});

const commentSchema = mongoose.Schema(
	{
		user: { type: String, required: true },
		userID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		comment: { type: String, required: true },
		hearts: { type: Number, required: true },
	},
	{
		timestamps: true,
	}
);

const joinedUsersSchema = mongoose.Schema(
	{
		user: { type: String, required: true },
		userID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

const eventSchema = mongoose.Schema(
	{
		adminID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		author: {
			type: String,
			required: true,
		},
		authorID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		name: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		ticketPrice: {
			type: Number,
			required: true,
		},
		availableTickets: {
			type: Number,
			required: true,
		},
		virtual: {
			type: Boolean,
			required: true,
			default: false,
		},
		password: {
			type: String,
			required: true,
		},
		eventCountry: [eventCountrySchema],
		comments: [commentSchema],
		joinedUsers: [joinedUsersSchema],
		endsOn: {
			day: { type: Number, required: true },
			month: { type: Number, required: true },
			year: { type: Number, required: true },
		},
	},
	{
		timestamps: true,
	}
);

eventSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

eventSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
