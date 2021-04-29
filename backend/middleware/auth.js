import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';

const protect = asyncHandler(async (req, res, next) => {
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			const token = req.headers.authorization.split(' ')[1];

			const decoded = jwt.verify(token, process.env.JWT_KEY);

			req.user = await User.findById(decoded.id).select('-password');

			next();
		} catch (error) {
			res.status(401);
			throw new Error('Not authorized, token failed');
		}
	} else {
		res.status(401);
		throw new Error('Not authorized, no token');
	}
});

const admin = (req, res, next) => {
	if (req.user && req.user.admin) {
		next();
	} else {
		res.status(401);
		throw new Error('Not authorized as an admin');
	}
};

export { protect, admin };
