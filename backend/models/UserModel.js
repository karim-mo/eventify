import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const shippingAddressSchema = mongoose.Schema(
	{
		address: { type: String, required: true },
		city: { type: String, required: true },
		postalCode: { type: String, required: true },
		country: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

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

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		admin: {
			type: Boolean,
			required: true,
			default: false,
		},
		ticketer: {
			type: Boolean,
			required: true,
			default: false,
		},
		country: {
			type: String,
			required: true,
		},
		confirmationURL: {
			type: String,
			unique: true,
		},
		isConfirmed: {
			type: Boolean,
			default: false,
		},
		eventID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Event',
			default: null,
		},
		shippingAddresses: [shippingAddressSchema],
		cart: [cartSchema],
	},
	{
		timestamps: true,
	}
);

userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
