const idValiation = require("../../validations/id.valiations");
const { render } = require("../renderRoute");
const {
	getLesson,
	getExercise,
} = require("../../controllers/user/lesson.controller");

const routes = {
	uses: [],
	routes: [
		{
			pattern: "/:id/exercises/:exercise",
			handle: [idValiation(), idValiation("exercise"), getExercise],
		},
		{
			pattern: "/:id",
			handle: [idValiation(), getLesson],
		},
	],
};

const router = render(routes);

module.exports = router;
