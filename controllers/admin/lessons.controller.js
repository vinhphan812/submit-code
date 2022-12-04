// @ts-nocheck
const { Lesson, Exercise } = require("../../models");

module.exports = {
	index: async (req, res, next) => {
		res.locals.seo.title = "Quản Lý Buổi Học";

		const lessons = await Lesson.getAll();
		for (let i = 0; i < lessons.length; i++) {
			const count = await Exercise.countDocuments({
				lesson: lessons[i]._id,
			});
			lessons[i].count = count;
			lessons[i]._doc.count = count;
		}
		res.locals.lessons = lessons;
		res.render("admin/lessons");
	},
	createPage: async (req, res, next) => {
		res.locals.isCreate = true;
		res.locals.seo.title = "Tạo Buổi Học";
		res.render("admin/lessons/lesson");
	},
	createHandle: async (req, res, next) => {
		const { body, errors } = res.locals;
		res.locals.isCreate = true;
		res.locals.seo.title = "Tạo Buổi Học";

		if (errors.length > 0) return res.render("admin/lessons/lesson");
		body.index = await Lesson.count({});
		const lesson = await Lesson.create(body);

		if (body.exercises && body.exercises.length) {
			body.exercises = body.exercises.map((e, i) => {
				e.description = e.description.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("\\n", "<br>").replaceAll("\\t", "      ")

				e.lesson = lesson.id;
				e.index = i + 1;
				return e;
			});
			await Exercise.create(body.exercises);
		}
		res.redirect(`/admin/lessons/${lesson.id}/update`);
	},
	updatePage: async (req, res, next) => {
		const { id } = req.params;

		const lesson = await Lesson.findOne({ _id: id });

		if (!lesson) return next();

		const exercises = await Exercise.find({ lesson: id }).sort({
			index: 1,
		});

		lesson.exercises = exercises;

		lesson._doc.exercises = exercises;

		res.locals.seo.title = "Cập nhật " + lesson.name;
		res.locals.body = lesson;

		res.render("admin/lessons/lesson");
	},
	updateHandle: async (req, res, next) => {
		const { exercises, ...body } = res.locals.body;
		const { id } = req.params;
		if (exercises && exercises.length) {
			let count = await Exercise.count({ lesson: id });
			await Exercise.create(
				exercises.map((e) => {
					e.lesson = id;
					e.index = ++count;
					return e;
				})
			);
		}
		await Lesson.updateOne({ _id: id }, { $set: body });
		res.redirect(`/admin/lessons/${id}/update`);
	},
	deleteHandle: async (req, res, next) => {},
	addExercisePage: async (req, res, next) => {
		const { id } = req.params;

		const lesson = await Lesson.findOne({ _id: id });

		if (!lesson) return next();

		res.locals.seo.title = "Thêm Bài Tập " + lesson.name;
		res.locals.isCreate = true;

		res.render("admin/lessons/add-exercise");
	},
	addExerciseHandle: async (req, res, next) => {},
};
