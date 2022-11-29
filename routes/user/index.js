const {
	decentralization,
	ROLE,
} = require("../../middlewares/decentralization.middleware");
const { render } = require("../renderRoute");
const lessonRoute = require("./lesson.route");
const submitRoute = require("./submit.route");

const routes = {
	uses: [
		{ handle: decentralization(ROLE.STUDENT) },
		{ pattern: "/lessons", handle: lessonRoute },
		{ pattern: "/exercises", handle: submitRoute },
	],
	routes: [],
};

const router = render(routes);

module.exports = router;
