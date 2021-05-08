import bcrypt from 'bcryptjs';

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
		password: bcrypt.hashSync('123456', 10),
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
		],
		joinedUsers: [],
		endsOn: {
			day: 30,
			month: 5,
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
		password: bcrypt.hashSync('123456', 10),
		eventCountry: [
			{
				countryName: 'Egypt',
				countryCode: 'EG',
			},
		],
		comments: [],
		joinedUsers: [],
		endsOn: {
			day: 1,
			month: 6,
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
		ticketPrice: 99.99,
		availableTickets: 0,
		virtual: false,
		password: bcrypt.hashSync('123456', 10),
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
		comments: [],
		joinedUsers: [],
		endsOn: {
			day: 28,
			month: 5,
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
		password: bcrypt.hashSync('123456', 10),
		eventCountry: [
			{
				countryName: 'United Kingdom',
				countryCode: 'UK',
			},
		],
		comments: [],
		joinedUsers: [],
		endsOn: {
			day: 1,
			month: 6,
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
		password: bcrypt.hashSync('123456', 10),
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
