import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import eventRoutes from './routes/eventRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const connectMongo = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
		});

		console.log(
			`MongoDB Connected: ${conn.connection.host}`.cyan.underline
		);
	} catch (error) {
		console.error(`Error: ${error.message}`.red.underline.bold);
		process.exit(1);
	}
};

connectMongo();

const app = express();

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
	);
	res.setHeader('Access-Control-Allow-Headers', '*');

	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.use(morgan('dev'));
app.use(express.json());

app.use('/eventifyapi/events', eventRoutes);
app.use('/eventifyapi/cart', cartRoutes);
app.use('/eventifyapi/user', userRoutes);
app.use('/eventifyapi/orders', orderRoutes);

app.get('/', (req, res) => {
	res.send('API online');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
	console.log(
		`Server running in ${process.env.DEV_MODE} mode on port ${PORT}`.green
			.bold
	)
);
