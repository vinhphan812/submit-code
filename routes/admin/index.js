const { render } = require("../renderRoute");
const { index } = require("../../controllers/admin");
const usersRoute = require("./users.route");
const lessonsRoute = require("./lessons.route");
const exercisesRoute = require("./exercises.route");
const {
	decentralization,
	ROLE,
} = require("../../middlewares/decentralization.middleware");

const routes = {
	uses: [
		{ handle: decentralization(ROLE.ADMIN) },
		{ pattern: "/users", handle: usersRoute },
		{ pattern: "/lessons", handle: lessonsRoute },
		{ pattern: "/exercises", handle: exercisesRoute },
	],
	routes: [{ pattern: "/", handle: index }],
};

const router = render(routes);

module.exports = router;
