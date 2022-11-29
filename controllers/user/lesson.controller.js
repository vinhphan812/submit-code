// @ts-nocheck
const { Lesson, Exercise, History } = require("../../models");
const { TEST_THRESHOLD, SUBMIT_THRESHOLD } = require("../../utils/constaints");
module.exports = {
	getLesson: async (req, res, next) => {
		const { id } = req.params;
		console.log("lessons");
		const lesson = await Lesson.get(id);
		if (!lesson) return next();

		res.locals.lesson = lesson;
		res.locals.seo.title = lesson.name;

		res.render("user/lesson");
	},
	getExercise: async (req, res, next) => {
		const { id, exercise } = req.params;
		const { user } = res.locals;

		const exerciseData = await Exercise.get(exercise);

		const submitHistory = await History.findOne({
			user: user.id,
			exercise,
			type: "TEST",
		});
		const testHistory = await History.findOne({
			user: user.id,
			exercise,
			type: "SUBMIT",
		});

		if (!exerciseData) return next();

		res.locals.seo.title = exerciseData.name;
		res.locals.exercise = exerciseData;
		res.locals.test_remaining = testHistory
			? testHistory.times
			: TEST_THRESHOLD;
		res.locals.submit_remaining = submitHistory
			? submitHistory.times
			: SUBMIT_THRESHOLD;

		res.render("user/lesson/submit");
	},
};
