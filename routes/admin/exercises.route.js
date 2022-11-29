const { render } = require("../renderRoute");
const {
	deleteHandle,
	updateHandle,
	updatePage,
} = require("../../controllers/admin/exercises.controller");

const idValiation = require("../../validations/id.valiations");
const {
	createExerciseValidation,
} = require("../../validations/create.validation");

const routes = {
	routes: [
		// {
		// 	pattern: "/",
		// 	handle: index,
		// },
		// { pattern: "/create", handle: createPage },
		// {
		// 	pattern: "/create",
		// 	method: "post",
		// 	handle: [createLessonValidation, createHandle],
		// },
		{
			pattern: "/:id/update",
			handle: idValiation(),
			method: "all",
			routes: [
				{
					method: "post",
					handle: [createExerciseValidation, updateHandle],
				},
				{ handle: updatePage },
			],
		},
		{
			pattern: "/:id/delete",
			handle: [idValiation(), deleteHandle],
		},
	],
};

const router = render(routes);

module.exports = router;
