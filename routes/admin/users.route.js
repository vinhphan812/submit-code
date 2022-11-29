const { render } = require("../renderRoute");

const {
	index,
	updatePage,
	updateHandle,
	deleteUser,
	createPage,
	createHandle,
} = require("../../controllers/admin/users.controller");
const idValiation = require("../../validations/id.valiations");
const { createUserValidation } = require("../../validations/create.validation");

/**
 * @type {import("../renderRoute").Routes}
 */
const routes = {
	routes: [
		{
			pattern: "/",
			handle: index,
		},
		{ pattern: "/create", handle: createPage },
		{
			pattern: "/create",
			handle: [createUserValidation, createHandle],
		},
		{
			pattern: "/:id/update",
			handle: idValiation(),
			method: "all",
			routes: [
				{
					method: "post",
					handle: updatePage,
				},
				{ handle: updatePage },
			],
		},
		{
			pattern: "/:id/delete",
			handle: [idValiation(), deleteUser],
		},
	],
};

const router = render(routes);

module.exports = router;
