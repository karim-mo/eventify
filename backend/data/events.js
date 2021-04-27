const events = [
	{
		Author: 'Admin User',
		authorID: 0,
		name: 'Adoma Event',
		image: '/images/airpods.jpg',
		description: 'Just an event lol',
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
		Author: 'Admin User',
		authorID: 0,
		name: 'YAAAAAY LOLOLOLOL',
		image: '/images/alexa.jpg',
		description: 'Join in and discover the fun!',
		category: 'Technology',
		ticketPrice: 99.99,
		availableTickets: 5,
		comments: [
			{
				commentID: 0,
				user: 'John Doe',
				userID: 1,
				comment: 'Trash Event.',
				hearts: 1,
			},
		],
		joinedUsers: [
			{
				name: 'Jane Doe',
				id: 2,
			},
		],
		endsOn: {
			day: 1,
			month: 5,
			year: 2021,
		},
	},
	{
		Author: 'Admin User',
		authorID: 0,
		name: 'YAAAAAY LOLO',
		image: '/images/sample.jpg',
		description: 'Dont join me pls',
		category: 'Misc',
		ticketPrice: 9999.99,
		availableTickets: 2,
		comments: [
			{
				commentID: 0,
				user: 'John Doe',
				userID: 1,
				comment: 'WTF??',
				hearts: 1,
			},
		],
		joinedUsers: [
			{
				name: 'Jane Doe',
				id: 2,
			},
		],
		endsOn: {
			day: 28,
			month: 4,
			year: 2021,
		},
	},
	{
		Author: 'Admin User',
		authorID: 0,
		name: 'YAAAAAY LOLOLOLOL',
		image: '/images/alexa.jpg',
		description: 'Join in and discover the fun!',
		category: 'Technology',
		ticketPrice: 99.99,
		availableTickets: 5,
		comments: [
			{
				commentID: 0,
				user: 'John Doe',
				userID: 1,
				comment: 'Trash Event.',
				hearts: 1,
			},
		],
		joinedUsers: [
			{
				name: 'Jane Doe',
				id: 2,
			},
		],
		endsOn: {
			day: 1,
			month: 5,
			year: 2021,
		},
	},
	{
		Author: 'Admin User',
		authorID: 0,
		name: 'YAAAAAY',
		image: '/images/sample.jpg',
		description: 'OH WELL',
		category: 'Music',
		ticketPrice: 99999.99,
		availableTickets: 3,
		comments: [],
		joinedUsers: [],
		endsOn: {
			day: 25,
			month: 4,
			year: 2021,
		},
	},
];

export default events;
