// @ts-nocheck
const { User } = require("../models/");

const { PERMISSIONS, ROLE, MENU_BY_ROLE } = require("../utils/role.enum");

module.exports = {
	ROLE,
	decentralization: (perms) => {
		return async (req, res, next) => {
			const userId = req.signedCookies.userId;

			let userPerms = ROLE.STUDENT;

			if (userId)
				userPerms = (
					await User.findOne({
						_id: userId,
					})
				).role;
			else return res.redirect("/sign_in");

			if (PERMISSIONS[userPerms] < PERMISSIONS[perms || ROLE.STUDENT])
				return res.status(403).render("error/404");

			res.locals.role = userPerms;

			next();
		};
	},
};
