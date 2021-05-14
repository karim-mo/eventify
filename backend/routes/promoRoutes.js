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

const getPromos = asyncHandler(async (req, res) => {
	const promosPerPage = 10;
	const pageNo = Number(req.query.pageNo) || 1;

	const promosCount = await PromoCode.countDocuments({});
	if (promosCount) {
		const pages = Math.ceil(promosCount / promosPerPage);
		if (pages < pageNo) {
			res.status(400);
			throw new Error('No promos to show.');
		}
		const promos = await PromoCode.find({})
			.limit(promosPerPage)
			.skip(promosPerPage * (pageNo - 1))
			.sort({ createdAt: -1 });

		res.json({ promos, pages });
	} else {
		res.status(404);
		throw new Error('No promos to show.');
	}
});

const addPromo = asyncHandler(async (req, res) => {
	const { code, discount } = req.body;

	const exists = await PromoCode.findOne({ code });
	if (exists) {
		res.status(400);
		throw new Error('Promo already exists');
	}

	const newPromo = {
		code,
		discount: Number(discount) > 100 ? 100 : Number(discount) < 0 ? 0 : Number(discount) / 100,
	};

	const created = await PromoCode.create(newPromo);
	if (created) {
		res.json({});
	} else {
		res.status(400);
		throw new Error('Failed to create promocode');
	}
});

const deletePromo = asyncHandler(async (req, res) => {
	const promo = await PromoCode.findById(req.params.id);
	if (promo) {
		await PromoCode.deleteOne({ _id: promo._id });
		res.json({});
	} else {
		res.status(404);
		throw new Error('No promos to delete');
	}
});

router.route('/').get(protect, admin, getPromos).put(protect, admin, addPromo);
router.route('/:id').delete(protect, admin, deletePromo);

export default router;
