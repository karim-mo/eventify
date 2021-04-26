import bcrypt from 'bcryptjs';

const users = [
	{
		id: 0,
		name: 'Admin User',
		email: 'admin@example.com',
		password: bcrypt.hashSync('123456', 10),
		admin: true,
		shippingAddresses: [],
		cart: [],
	},
	{
		id: 1,
		name: 'John Doe',
		email: 'john@example.com',
		password: bcrypt.hashSync('123456', 10),
		admin: false,
		shippingAddresses: [],
		cart: [],
	},
	{
		id: 2,
		name: 'Jane Doe',
		email: 'jane@example.com',
		password: bcrypt.hashSync('123456', 10),
		admin: false,
		shippingAddresses: [],
		cart: [],
	},
];

export default users;
