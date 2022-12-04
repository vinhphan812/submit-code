const { render } = require("./renderRoute");
const {
	signUpHandle,
	loginPage,
	loginHandle,
	registerPage,
	logoutHandle,
} = require("../controllers/auth.controller");
const { signUpValidate } = require("../validations/auth.validation");

const routes = {
	routes: [
		{ method: "get", pattern: "/sign_in", handle: loginPage },
		{
			method: "post",
			pattern: "/sign_in",
			handle: loginHandle,
		},
		{ method: "get", pattern: "/sign_up", handle: registerPage },
		{
			method: "post",
			pattern: "/sign_up",
			handle: [signUpValidate, signUpHandle],
		},
		{ method: "get", pattern: "/logout", handle: logoutHandle },
	],
};

const router = render(routes);

module.exports = router;
