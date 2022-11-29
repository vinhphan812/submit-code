const { User } = require("../../models/index");
const { ROLE } = require("../../utils/role.enum");

module.exports = {
	index: async (req, res, next) => {
		res.locals.seo.title = "Quản Lý Người Dùng";

		res.locals.users = await User.find({ is_delete: false });
		res.render("admin/users");
	},
	updatePage: async (req, res, next) => {
		const { id } = req.params;
		res.locals.seo.title = "Chỉnh Sửa Người Dùng";
		res.locals.body = await User.findOne({ _id: id });
		res.locals.role = Object.values(ROLE);
		res.render("admin/users/user");
	},
	updateHandle: async (req, res, next) => {
		const { id } = req.params;
		const { body, errors } = res.locals;

		if (errors.length) {
			res.locals.seo.title = "Chỉnh Sửa Người Dùng";
			res.locals.role = Object.values(ROLE);
			res.render("admin/users/user");
		}
		await User.updateOne({ _id: id }, { $set: body });
		res.redirect("/admin/users");
	},
	deleteUser: async (req, res, next) => {
		const { id } = req.params;

		await User.updateOne({ _id: id }, { $set: { is_delete: true } });

		res.redirect("/admin/users");
	},
	createPage: async (req, res, next) => {
		res.locals.seo.title = "Tạo người dùng";
		res.locals.isCreate = true;
		res.locals.role = Object.values(ROLE);

		res.render("admin/users/user");
	},
	createHandle: async (req, res, next) => {},
};
