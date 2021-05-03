import mongoose from 'mongoose';

const promoSchema = mongoose.Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
		},
		discount: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const PromoCode = mongoose.model('PromoCode', promoSchema);

export default PromoCode;
