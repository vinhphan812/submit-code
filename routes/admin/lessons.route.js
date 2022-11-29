const { render } = require("../renderRoute");
const {
	index,
	createPage,
	createHandle,
	updatePage,
	updateHandle,
	deleteHandle,
	addExerciseHandle,
	addExercisePage,
} = require("../../controllers/admin/lessons.controller");

const idValiation = require("../../validations/id.valiations");
const {
	createLessonValidation,
} = require("../../validations/create.validation");

const routes = {
	routes: [
		{
			pattern: "/",
			handle: index,
		},
		{ pattern: "/create", handle: createPage },
		{
			pattern: "/create",
			method: "post",
			handle: [createLessonValidation, createHandle],
		},
		{
			pattern: "/:id/update",
			handle: idValiation(),
			method: "all",
			routes: [
				{
					method: "post",
					handle: [createLessonValidation, updateHandle],
				},
				{ handle: updatePage },
			],
		},
		{
			pattern: "/:id/delete",
			handle: [idValiation(), deleteHandle],
		},
		{
			pattern: "/:id/exercise",
			method: "all",
			handle: idValiation(),
			routes: [
				{ handle: addExercisePage },
				{ handle: addExerciseHandle, method: "post" },
			],
		},
	],
};

const router = render(routes);

module.exports = router;
