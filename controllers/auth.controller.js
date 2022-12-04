const md5 = require("md5");
const { User } = require("../models");

module.exports = {
	loginPage: (req, res, next) => {
		res.locals.seo.title = "Đăng Nhập";
		res.render("account/sign_in");
	},
	registerPage: (req, res, next) => {
		res.locals.seo.title = "Đăng Ký";
		res.render("account/sign_up");
	},
	loginHandle: async (req, res, next) => {
		res.locals.seo.title = "Đăng Nhập";
		const { user, pass } = req.body;
		const errors = [];
		res.locals.login = { user, pass };

		const userData = await User.findOne({
			$and: [
				{
					$or: [
						{ username: user },
						{ email: user },
					],
				},
				{ is_delete: false, password: md5(pass) },
			],
		});

		if (!userData) {
			errors.push("Tài khoản, mật khẩu bạn vừa nhập chưa đúng");
			res.render("account/sign_in", { errors });
		} else {
			res.cookie("userId", userData.id, { signed: true });
			res.redirect(userData.role == "ADMIN" ? "/admin" : "/");
		}
	},

	signUpHandle: async (req, res, next) => {
		res.locals.seo.title = "Đăng Ký";
		const { body, errors } = res.locals;

		if (errors.length) {
			return res.render("account/sign_up");
		}

		body.password = md5(body.password);

		const userCreated = await User.create(body);

		res.redirect("/sign_in");
	},

	logoutHandle: (req, res, next) => {
		res.clearCookie("userId").redirect("/");
	},
};
