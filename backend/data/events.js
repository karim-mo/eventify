const events = [
	{
		adminID: 0,
		author: 'Admin User',
		authorID: 0,
		name: 'Adoma Event',
		image: '/images/slide3.jpg',
		description: `Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Nam doloribus modi,
                    facilis, ut possimus iste quae autem
                    nisi accusamus veniam amet minus ratione
                    voluptates totam velit animi iusto
                    debitis dolorem?`,
		category: 'Entertainment',
		ticketPrice: 89.99,
		availableTickets: 3,
		virtual: false,
		eventCountry: [
			{
				countryName: 'United States of America',
				countryCode: 'US',
			},
			{
				countryName: 'global',
				countryCode: 'GLOBAL',
			},
		],
		comments: [
			{
				user: 'John Doe',
				userID: 1,
				comment: 'Trash Event.',
				hearts: 1,
			},
			{
				user: 'Jane Doe',
				userID: 2,
				comment: 'Ignore the guy above, he trash.',
				hearts: 10,
			},
		],
		joinedUsers: [
			{
				user: 'John Doe',
				userID: 1,
			},
			{
				user: 'Jane Doe',
				userID: 2,
			},
		],
		endsOn: {
			day: 30,
			month: 4,
			year: 2021,
		},
	},
	{
		adminID: 0,
		author: 'John Doe',
		authorID: 1,
		name: 'YAAAAAY LOLOLOLOL',
		image: '/images/alexa.jpg',
		description: 'Join in and discover the fun!',
		category: 'Technology',
		ticketPrice: 99.99,
		availableTickets: 5,
		virtual: false,
		eventCountry: [
			{
				countryName: 'Egypt',
				countryCode: 'EG',
			},
		],
		comments: [
			{
				user: 'Jane Doe',
				userID: 2,
				comment: 'Trash Event.',
				hearts: 1,
			},
		],
		joinedUsers: [
			{
				user: 'Jane Doe',
				userID: 2,
			},
		],
		endsOn: {
			day: 1,
			month: 5,
			year: 2021,
		},
	},
	{
		adminID: 0,
		author: 'John Doe',
		authorID: 1,
		name: 'YAAAAAY LOLO',
		image: '/images/sample.jpg',
		description: 'Dont join me pls',
		category: 'Misc',
		ticketPrice: 9999.99,
		availableTickets: 0,
		virtual: false,
		eventCountry: [
			{
				countryName: 'United States of America',
				countryCode: 'US',
			},
			{
				countryName: 'Egypt',
				countryCode: 'EG',
			},
			{
				countryName: 'global',
				countryCode: 'GLOBAL',
			},
		],
		comments: [
			{
				user: 'Jane Doe',
				userID: 2,
				comment: 'WTF??',
				hearts: 1,
			},
		],
		joinedUsers: [
			{
				user: 'Jane Doe',
				userID: 2,
			},
		],
		endsOn: {
			day: 28,
			month: 4,
			year: 2021,
		},
	},
	{
		adminID: 0,
		author: 'Jane Doe',
		authorID: 2,
		name: 'YAAAAAY LOLOLOLOL',
		image: '/images/alexa.jpg',
		description: 'Join in and discover the fun!',
		category: 'Technology',
		ticketPrice: 99.99,
		availableTickets: 5,
		virtual: false,
		eventCountry: [
			{
				countryName: 'United Kingdom',
				countryCode: 'UK',
			},
		],
		comments: [
			{
				user: 'Jane Doe',
				userID: 2,
				comment: 'Trash Event.',
				hearts: 1,
			},
		],
		joinedUsers: [
			{
				user: 'Jane Doe',
				userID: 2,
			},
		],
		endsOn: {
			day: 1,
			month: 5,
			year: 2021,
		},
	},
	{
		adminID: 0,
		author: 'Admin User',
		authorID: 0,
		name: 'YAAAAAY',
		image: '/images/sample.jpg',
		description: 'OH WELL',
		category: 'Music',
		ticketPrice: 99999.99,
		availableTickets: 3,
		virtual: false,
		eventCountry: [
			{
				countryName: 'global',
				countryCode: 'GLOBAL',
			},
		],
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
