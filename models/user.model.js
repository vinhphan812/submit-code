const { initModel } = require("./base.model");

const User = initModel("USER", {
	password: String,
	email: String,
	name: String,
	username: String,
	role: { type: String, enum: ["STUDENT", "TEACHER"], default: "STUDENT" },
});

module.exports = User;
