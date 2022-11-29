module.exports = {
	errorMiddleware: (req, res, next) => {
		res.locals.seo.title = "404 Not Found";
		res.render("errors/404");
	},
};
