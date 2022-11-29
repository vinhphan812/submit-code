// @ts-nocheck
const { initModel } = require("./base.model");
const Exercise = require("./exercise.model");

const Lesson = initModel(
	"LESSON",
	{
		name: { type: String, default: "" },
		index: { type: Number, default: 0 },
		description: { type: String, default: "" },
	},
	{
		getAll: async function () {
			const lessons = await this.find({}).sort({ index: 1 });
			for (let i = 0; i < lessons.length; i++) {
				const count = await Exercise.countDocuments({
					lesson: lessons[i]._id,
				});
				lessons[i].count = count;
				lessons[i]._doc.count = count;
			}
			return lessons;
		},
		get: async function (_id) {
			const lesson = await this.findOne({ _id });
			if (!lesson) return null;

			const exersices = await Exercise.getByLesson(_id);
			lesson._doc.exercises = exersices;
			lesson.exercises = exersices;
			return lesson;
		},
	}
);

module.exports = Lesson;
