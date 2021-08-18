import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URI,
	ssl: {
		rejectUnauthorized: false,
	},
});

export default pool;
