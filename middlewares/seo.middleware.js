const { APP_NAME } = process.env;
const { MENU_BY_ROLE } = require("../utils/role.enum");
const moment = require("moment");
const { User } = require("../models");

module.exports = {
	seoConfigMiddleware: async (req, res, next) => {
		// check user
		const { userId } = req.signedCookies;

		if (userId) {
			const user = await User.findOne({ _id: userId });

			res.locals.menu = MENU_BY_ROLE[user.role];
			res.locals.user = user;
			res.locals.userId = userId;
		}

		// role display UI
		res.locals.listNotDisplaySignNav = ["/sign_in", "/sign_up"];
		res.locals.errors = [];

		res.locals.isHosting = req.hostname != "localhost";
		res.locals.moment = moment;

		// init seo config object saving to locals response storage
		res.locals.seo = {
			title: "",
			description: "",
			keywords: [],
			url: "https://" + req.hostname + req.url,
			image: "",
		};

		// saving path for check
		res.locals.path = req.url;
		// saving APP_NAME
		res.locals.APP_NAME = APP_NAME;

		next();
	},
};
