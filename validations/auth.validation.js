const { User } = require("../models");
const request = require("request-promise");

module.exports = {
	signUpValidate: async (req, res, next) => {
		const { username, password, email, passwordConfirm } = req.body;
		let name = "";

		const errors = [];

		if (!username || !password || !email || !passwordConfirm) {
			errors.push("Vui lòng điền đầy đủ thông tin...!");
		}

		if (password != passwordConfirm) {
			errors.push("Mật khẩu xác nhận không đúng");
		}

		const emailRegistedCheck = await User.findOne({ email });
		const userRegistedCheck = await User.findOne({ username });

		if (emailRegistedCheck) errors.push("Email đã được đang ký...!");

		if (userRegistedCheck)
			errors.push("Tên đăng nhập đã được đăng ký...!");

		const data = JSON.parse(
			await request(
				"https://chatbot.vinhphancommunity.xyz/test/schedule?id=" +
					username
			)
		);

		if (!data.success) errors.push(data.msg);
		else name = data.name;
		res.locals.errors = errors;

		res.locals.body = {
			name,
			username,
			password,
			email,
			passwordConfirm,
		};

		next();
	},
	forgotValidate: async (req, res, next) => {
		const { email } = req.body;

		let isExist = false;

		if (await User.find({ email })) isExist = true;

		if (isExist) next();
		else return res.json({ sucess: false, message: "EMAIL_NOT_EXIST" });
	},
};
