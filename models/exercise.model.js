const { initModel, ObjectId } = require("./base.model");
const TestCase = require("./testcase.model");

const Exercise = initModel(
	"EXERCISE",
	{
		name: { type: String, default: "" },
		index: { type: Number, default: 0 },
		description: { type: String, default: "" },
		lesson: { type: ObjectId, ref: "LESSON" },
	},
	{
		getByLesson: function (lesson) {
			return this.find({ lesson }).sort({ index: 1 });
		},
		get: async function (_id) {
			const ex = await this.findOne({ _id });
			const test_cases = await TestCase.find({ exercise: _id });
			ex._doc.testcases = test_cases;
			ex.testcases = test_cases;
			return ex;
		},
	}
);

module.exports = Exercise;
