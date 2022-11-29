const idValiation = require("../../validations/id.valiations");
const { render } = require("../renderRoute");
const { run, submit } = require("../../controllers/user/exercise.controller");

const routes = {
	uses: [],
	routes: [
		{
			pattern: "/:id/run",
			handle: [idValiation(), run],
		},
		{
			pattern: "/:id/submit",
			handle: [idValiation(), submit],
		},
	],
};

const router = render(routes);

module.exports = router;
