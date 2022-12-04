const morganConfig = `:date[clf]] ":method :url HTTP/:http-version" :status :response-time ms`;

const THRESHOLD = {
	TEST: 5,
	SUBMIT: 1
}

const SCHEMA_OPTION = {
	versionKey: false,
	minimize: false,
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
};
module.exports = {
	SCHEMA_OPTION,
	morganConfig,
	THRESHOLD
};
