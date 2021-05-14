import dotenv from 'dotenv';
import mongoose from 'mongoose';
import colors from 'colors';
import users from './data/users.js';
import events from './data/events.js';
import User from './models/UserModel.js';
import Event from './models/EventModel.js';
import Order from './models/OrderModel.js';
import Ticket from './models/QRTicketModel.js';

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

const importData = async () => {
	try {
		await Order.deleteMany();
		await Event.deleteMany();
		await Ticket.deleteMany();

		// await User.deleteMany();

		// const createdUsers = await User.insertMany(users);
		const adminUser = await User.findById('608c39f4eca4ca7624775945');

		const _events = await Promise.all(
			events.map(async (event) => {
				const _user = await User.findOne({
					name: event.author,
				});

				return {
					...event,
					adminID: adminUser._id,
					authorID: _user._id,
					comments: await Promise.all(
						event.comments.map(async (comment) => {
							const user = await User.findOne({
								name: comment.user,
							});
							return { ...comment, userID: user._id };
						})
					),
					joinedUsers: await Promise.all(
						event.joinedUsers.map(async (joinedUser) => {
							const user = await User.findOne({
								name: joinedUser.user,
							});
							return { ...joinedUser, userID: user._id };
						})
					),
				};
			})
		);

		await Event.insertMany(_events);

		console.log('Data Imported!'.green.inverse);
		process.exit();
	} catch (error) {
		console.error(`${error}`.red.inverse);
		process.exit(1);
	}
};

const destroyData = async () => {
	try {
		await Order.deleteMany();

		// await Event.deleteMany();
		// await User.deleteMany();

		console.log('Data Destroyed!'.red.inverse);
		process.exit();
	} catch (error) {
		console.error(`${error}`.red.inverse);
		process.exit(1);
	}
};

const addToUserModel = async () => {
	try {
		const users = await User.find({});
		for (let user of users) {
			let _user = await User.findById(user._id);
			_user.ticketer = false;
			if (!_user.name.startsWith('Karim')) {
				_user.eventID = null;
			}
			await _user.save();
		}

		console.log('User Edited!'.green.inverse);
		process.exit();
	} catch (error) {
		console.error(`${error}`.red.inverse);
		process.exit(1);
	}
};

if (process.argv[2] === '-d') {
	destroyData();
} else {
	importData();
}
