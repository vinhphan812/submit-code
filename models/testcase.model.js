const { initModel, ObjectId } = require("./base.model");

const TestCase = initModel(
	"TESTCASE",
	{
		input: String,
		output: String,
		name: String,
		index: {type: Number, default: 0},
		exercise: { type: ObjectId, ref: "EXERCISE" },
	},
	{
		getByExercise: function (exercise) {
			return this.find({ exercise });
		},
	}
);

module.exports = TestCase;
