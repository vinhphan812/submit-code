const { TestCase } = require("../../models");
const { compile } = require("../../modules/compiler");

module.exports = {
	run: async (req, res, next) => {
		const { id } = req.params;
		const { source } = req.body;
		try {
			const testcases = await TestCase.find({ exercise: id });
		} catch (err) {
			res.json({ success: false, message: err.message });
		}
	},
	submit: async (req, res, next) => {},
};
