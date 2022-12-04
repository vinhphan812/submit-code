const { initModel, ObjectId } = require("./base.model");
const { EHistoryType } = require("../utils/types");

const History = initModel("HISTORY", {
	user: { type: ObjectId, ref: "USER" },
	exercise: { type: ObjectId, ref: "EXERCISE" },
	times: { type: Number, default: 1 },
	type: { type: String, default: "TEST", enum: Object.values(EHistoryType) },
});

module.exports = History;
