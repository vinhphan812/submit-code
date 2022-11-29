const { initModel, ObjectId } = require("./base.model");
const History = initModel("HISTORY", {
	user: { type: ObjectId, ref: "USER" },
	exercises: { type: ObjectId, ref: "EXERCISE" },
	times: { type: Number, default: 0 },
	type: { type: String, default: "TEST", enum: ["SUBMIT", "TEST"] },
});

module.exports = History;
