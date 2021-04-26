const events = [
	{
		name: 'Adoma Event',
		image: '/images/airpods.jpg',
		description: 'Just an event lol',
		Author: 'John Doe',
		category: 'Entertainment',
		ticketPrice: 89.99,
		availableTickets: 3,
		comments: [
			{
				commentID: 0,
				user: 'John Doe',
				userID: 1,
				comment: 'Trash Event.',
				hearts: 1,
			},
			{
				commentID: 1,
				user: 'Jane Doe',
				userID: 2,
				comment: 'Ignore the guy above, he trash.',
				hearts: 10,
			},
		],
		joinedUsers: [
			{
				name: 'John Doe',
				id: 1,
			},
			{
				name: 'Jane Doe',
				id: 2,
			},
		],
		endsOn: {
			day: 30,
			month: 4,
			year: 2021,
		},
	},
	{
		name: 'iPhone 11 Pro 256GB Memory',
		image: '/images/phone.jpg',
		description:
			'Introducing the iPhone 11 Pro. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life',
		brand: 'Apple',
		category: 'Electronics',
		price: 599.99,
		countInStock: 10,
		rating: 0,
		numReviews: 0,
	},
	{
		name: 'Cannon EOS 80D DSLR Camera',
		image: '/images/camera.jpg',
		description:
			'Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself using a pair of robust focusing systems and an intuitive design',
		brand: 'Cannon',
		category: 'Electronics',
		price: 929.99,
		countInStock: 0,
		rating: 0,
		numReviews: 0,
	},
	{
		name: 'Sony Playstation 4 Pro White Version',
		image: '/images/playstation.jpg',
		description:
			'The ultimate home entertainment center starts with PlayStation. Whether you are into gaming, HD movies, television, music',
		brand: 'Sony',
		category: 'Electronics',
		price: 399.99,
		countInStock: 10,
		rating: 0,
		numReviews: 0,
	},
	{
		name: 'Logitech G-Series Gaming Mouse',
		image: '/images/mouse.jpg',
		description:
			'Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse. The six programmable buttons allow customization for a smooth playing experience',
		brand: 'Logitech',
		category: 'Electronics',
		price: 49.99,
		countInStock: 7,
		rating: 0,
		numReviews: 0,
	},
	{
		name: 'Amazon Echo Dot 3rd Generation',
		image: '/images/alexa.jpg',
		description:
			'Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small space',
		brand: 'Amazon',
		category: 'Electronics',
		price: 29.99,
		countInStock: 0,
		rating: 0,
		numReviews: 0,
	},
];

export default events;
