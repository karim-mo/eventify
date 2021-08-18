import postgresClient from './postgres.js';

// Users DB
export const Users = {
	findById: function (id) {
		return new Promise((resolve, reject) => {
			postgresClient.query(
				`SELECT * FROM users
                WHERE _id = $1`,
				[id],
				(err, result) => {
					if (err) reject(err);
					else resolve(result.rows[0]);
				}
			);
		});
	},
	simpleFindOne: function (query, value) {
		return new Promise((resolve, reject) => {
			postgresClient.query(
				`SELECT * FROM users
                WHERE "${query}" = $1
                LIMIT 1`,
				[value],
				(err, result) => {
					if (err) reject(err);
					else resolve(result.rows[0]);
				}
			);
		});
	},
	create: function (data) {
		const columns = ['name', 'email', 'password', 'country'];

		for (const [key, value] of Object.entries(data)) {
			if (!columns.includes(key)) {
				throw new Error('Missing Data');
			}
		}

		return new Promise((resolve, reject) => {
			postgresClient.query(
				`INSERT INTO users(
                name, 
                email, 
                password, 
                admin, 
                ticketer, 
                country, 
                "confirmationURL", 
                "isConfirmed", 
                "createdAt")

                VALUES(
                $1, 
                $2, 
                $3, 
                FALSE, 
                FALSE, 
                $4, 
                'n/a', 
                FALSE, 
                CURRENT_TIMESTAMP)
                RETURNING *`,
				[data.name, data.email, data.password, data.country],
				(err, result) => {
					if (err) reject(err);
					else resolve(result.rows[0]);
				}
			);
		});
	},
	update: function (queries, values, condition, conditionValue) {
		const columns = [
			'_id',
			'name',
			'email',
			'password',
			'admin',
			'ticketer',
			'country',
			'confirmationURL',
			'isConfirmed',
			'createdAt',
		];

		queries?.forEach((query) => {
			if (!columns.includes(query)) {
				throw new Error('Wrong column data');
			}
		});

		if (queries?.length === 0) {
			throw new Error('No query entered');
		}

		if ((condition?.AND?.length > 0 || condition?.OR?.length > 0) && condition?.single?.length > 0) {
			throw new Error('Cannot merge single queries with conditional queries.');
		}

		if (condition?.AND?.length === 0 && condition?.OR?.length === 0 && condition?.single?.length === 0) {
			throw new Error('No condition entered');
		}

		let query = `UPDATE users
        SET `;

		let ind = 0;
		let conditions = 0;

		queries?.forEach((q, index) => {
			query += `"${q}" = $${ind + 1}`;

			if (ind < queries.length - 1) query += ', ';
			ind++;
		});

		query += `
        WHERE (`;

		if (condition?.AND?.length > 0) query += '(';

		condition?.AND?.forEach((q, index) => {
			const multiQuery = q.split(' ');
			if (!multiQuery.includes('OR') && multiQuery.length > 1) {
				throw new Error('Wrong conditions passed to update.');
			}

			const multiQueries = multiQuery.filter((_q) => _q === 'OR').length;
			if (multiQuery.length > 1 && multiQueries != Math.floor(multiQuery.length / 2)) {
				throw new Error('Invalid condition.');
			}

			if (multiQueries > 0) query += '(';

			multiQuery.forEach((_q, i) => {
				if (_q != 'OR') {
					query += `"${_q}" = $${ind + 1}`;
					ind++;
				} else {
					query += ` ${_q} `;
				}
			});

			if (multiQueries > 0) query += ')';
			if (index < condition.AND.length - 1) query += ' AND ';

			conditions += multiQueries + 1;
		});

		if (condition?.AND?.length > 0) query += ')';

		if (condition?.OR?.length > 0 && condition?.AND?.length > 0) query += ' OR (';

		if (condition?.OR?.length > 0) query += '(';

		condition?.OR?.forEach((q, index) => {
			const multiQuery = q.split(' ');
			if (!multiQuery.includes('AND') && multiQuery.length > 1) {
				throw new Error('Wrong conditions passed to update.');
			}

			const multiQueries = multiQuery.filter((_q) => _q === 'AND').length;
			if (multiQuery.length > 1 && multiQueries != Math.floor(multiQuery.length / 2)) {
				throw new Error('Invalid condition.');
			}

			if (multiQueries > 0) query += '(';

			multiQuery.forEach((_q, i) => {
				if (_q != 'AND') {
					query += `"${_q}" = $${ind + 1}`;
					ind++;
				} else {
					query += ` ${_q} `;
				}
			});

			if (multiQueries > 0) query += ')';
			if (index < condition.OR.length - 1) query += ' OR ';

			conditions += multiQueries + 1;
		});

		if (condition?.OR?.length > 0) query += ')';

		if (condition?.single?.length > 1) {
			throw new Error('Invalid condition.');
		}

		if (condition?.single?.length > 0) {
			query += `"${condition?.single[0]}" = $${ind + 1}`;
			conditions++;
		}

		query += `)
        RETURNING *`;

		if (queries?.length !== values?.length || conditions !== conditionValue?.length) {
			throw new Error('Query/condition count do not match their value count');
		}

		return new Promise((resolve, reject) => {
			postgresClient.query(query, [...values, ...conditionValue], (err, result) => {
				if (err) reject(err);
				else resolve(result.rows[0]);
			});
		});
	},
};
