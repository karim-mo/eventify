const notFound = (req, res, next) => {
	const error = new Error(`Path to URL Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
};

const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		message: err.message,
		stack: process.env.DEV_MODE === 'production' ? null : err.stack,
	});
};

export { notFound, errorHandler };
