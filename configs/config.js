const { db_url, db_user, db_pass, db_name, redisURL, redisKey } = process.env;
const mongoose = require("mongoose");

module.exports = {
	initDatabase: () => {
		// connect database from .env
		if (db_url)
			mongoose.connect(db_url, {
				user: db_user,
				pass: db_pass,
				dbName: db_name,
			});
	},
};
