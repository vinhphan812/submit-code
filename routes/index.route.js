const { render } = require("./renderRoute");
const { home } = require("../controllers/index.controller");
const authRoute = require("./auth.route");
const adminRoute = require("./admin");
const userRoute = require("./user");

const routes = {
	uses: [
		{ pattern: "/", handle: authRoute },
		{ pattern: "/", handle: userRoute },
		{ pattern: "/admin", handle: adminRoute },
	],
	routes: [{ method: "get", pattern: "/", handle: home }],
};

const router = render(routes);

module.exports = router;
