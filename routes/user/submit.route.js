const idValiation = require("../../validations/id.valiations");
const { render } = require("../renderRoute");
const { run } = require("../../controllers/user/submit.controller");
const { submitMiddleware } = require("../../middlewares/submit.middleware");

const routes = {
    uses: [],
    routes: [
        {
            pattern: "/:id/:type",
            handle: [idValiation(), submitMiddleware, run],
            method: "post"
        },
    ],
};

const router = render(routes);

module.exports = router;
