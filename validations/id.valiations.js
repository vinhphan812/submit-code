module.exports = (name = "id") => {
	return (req, res, next) => {
		const id = req.params[name];
		if (id.length != 24) res.render("errors/404");
		next();
	};
};
