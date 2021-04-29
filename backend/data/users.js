import bcrypt from 'bcryptjs';

const users = [
	{
		name: 'Admin User',
		email: 'admin@example.com',
		password: bcrypt.hashSync('123456', 10),
		admin: true,
		country: 'US',
		shippingAddresses: [],
		cart: [],
	},
	{
		name: 'John Doe',
		email: 'john@example.com',
		password: bcrypt.hashSync('123456', 10),
		admin: false,
		country: 'EG',
		shippingAddresses: [],
		cart: [],
	},
	{
		name: 'Jane Doe',
		email: 'jane@example.com',
		password: bcrypt.hashSync('123456', 10),
		admin: false,
		country: 'UK',
		shippingAddresses: [],
		cart: [],
	},
];

export default users;
