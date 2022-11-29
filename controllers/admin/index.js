module.exports = {
	index: (req, res, next) => {
		res.locals.seo.title = "Dashboard";
		return res.render("admin/index");
	},
};
