const morganConfig = `:date[clf]] ":method :url HTTP/:http-version" :status :response-time ms`;

const TEST_THRESHOLD = 5;
const SUBMIT_THRESHOLD = 1;

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
	TEST_THRESHOLD,
	SUBMIT_THRESHOLD,
};
