const mongoose = require("mongoose");
const { SCHEMA_OPTION } = require("../utils/constaints");

const initModel = (
	documentName,
	schemaObj = {},
	staticFuntions = {},
	methodFunction = {}
) => {
	const { Schema } = mongoose;

	const BaseSchema = new Schema(
		{ ...schemaObj, is_delete: { type: Boolean, default: false } },
		SCHEMA_OPTION
	);

	BaseSchema.static(staticFuntions);

	BaseSchema.method(methodFunction);

	return mongoose.model(documentName, BaseSchema, documentName);
};

module.exports = { initModel, ...mongoose.Schema.Types };
