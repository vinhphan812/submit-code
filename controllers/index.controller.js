// @ts-nocheck
const { Lesson } = require("../models");

module.exports = {
	home: async (req, res, next) => {
		res.locals.seo.title = "Trang Chủ";
		res.locals.lessons = await Lesson.getAll();

		res.render("home");
	},
};
