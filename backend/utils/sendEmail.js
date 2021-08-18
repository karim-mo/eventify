import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';
import colors from 'colors';

const sendEmail = (details) => {
	let transporter = nodemailer.createTransport({
		host: 'smtpout.secureserver.net',
		port: 465,
		secure: true,
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PW,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	return new Promise((resolve, reject) => {
		transporter.sendMail(
			{
				from: process.env.MAIL_USER,
				to: details.to,
				subject: details.subject || 'Please confirm your email address ✔',
				text:
					details.text ||
					`In order to continue using Eventify, you need to click on the link below to verify your email address.
        http://localhost:3000/confirmation/${details.URL}`,
			},
			(err, info) => {
				if (err) reject(err);
				else resolve(info);
			}
		);
	});
};

export default sendEmail;
