const { Exercise, TestCase } = require("../../models");

module.exports = {
	updateHandle: async (req, res, next) => {
		const { id } = req.params;
		const { test_cases, ...body } = res.locals.body;
		const { errors } = res.locals;

		if (errors.length) return res.render("admin/exercises/exercise");

		await Exercise.updateOne({ _id: id }, { $set: body });

		if (test_cases && test_cases.length) {
			let count = await TestCase.count({ exercise: id });
			await TestCase.create(
				test_cases.map((e) => {
					e.exercise = id;
					e.index = ++count;
					return e;
				})
			);
		}
		res.redirect(`/admin/exercises/${id}/update`);
	},
	updatePage: async (req, res, next) => {
		const { id } = req.params;

		const exercise = await Exercise.findOne({ _id: id });

		if (!exercise) return next();

		// @ts-ignore
		exercise.test_cases = await TestCase.getByExercise(exercise._id);

		res.locals.body = exercise;
		// @ts-ignore
		res.locals.seo.title = "Cập nhật " + exercise.name;

		res.render("admin/exercises/exercise");
	},
	deleteHandle: async (req, res) => {
		const { id } = req.params;

		await Exercise.updateOne({ _id: id }, { $set: { is_delete: true } });
	},
};
