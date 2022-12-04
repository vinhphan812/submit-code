const mongoose = require("mongoose");
const { SCHEMA_OPTION } = require("../utils/constaints");

/**
 *
 * @param {String} documentName is a name for model
 * @param {Object} schemaObj is a schema for model
 * @param {{[name:string]: Function}} staticFuntions is a all static function call for model
 * @param {{[name:string]: Function}} methodFunction us a all method function call for document
 * @returns
 */
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

	// @ts-ignores
	BaseSchema.static(staticFuntions);

	BaseSchema.method(methodFunction);

	return mongoose.model(documentName, BaseSchema, documentName);
};

module.exports = { initModel, ...mongoose.Schema.Types };
