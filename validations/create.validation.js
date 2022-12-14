const { User, Lesson } = require("../models");
const { ROLE } = require("../utils/role.enum");
const { build } = require("../modules/compiler");

module.exports = {
    createUserValidation: async (req, res, next) => {
        const { id } = req.params;
        const { username, name, email, role } = req.body;

        const errors = [];

        if (!username || !email || !role) errors.push("Vui lòng điền đầy đủ thông tin...!");

        if (!id) {
            const usernameExisted = await User.findOne({ username });
            const emailExisted = await User.findOne({ email });

            if (usernameExisted) errors.push("Tên đăng nhập đã được đăng ký...!");
            if (emailExisted) errors.push("Email đã được đăng ký...!");
        }

        res.locals.errors = errors;

        res.locals.body = {
            username, name, email, role, password: "12345678",
        };

        next();
    }, createLessonValidation: async (req, res, next) => {
        const { id } = req.params;
        const { name, description, exercises } = req.body;

        const errors = [];

        if (!name || !description || !exercises) errors.push("Vui lòng điền đầy đủ thông tin...!");

        if (!id) {
            const nameExisted = await Lesson.findOne({ name });
            if (nameExisted) errors.push("Tên buổi học đã tồn tại");
        }

        res.locals.errors = errors;

        res.locals.body = {
            name, description, exercises: JSON.parse(exercises),
        };
        next();
    }, createExerciseValidation: async (req, res, next) => {
        const { id } = req.params;
        const { name, description, test_cases, source, template } = req.body;

        const errors = [];

        if (!name || !source) errors.push("Vui lòng điền đầy đủ thông tin...!");

        if (!id) {
            const nameExisted = await Lesson.findOne({ name });
            if (nameExisted) errors.push("Tên buổi học đã tồn tại");
        }

        let exePath;

        try {
            exePath = (await build(source)).exePath;
        } catch (e) {
            errors.push(e.message);
        }

        res.locals.errors = errors;

        res.locals.body = {
            exePath, source, template, name, description, test_cases: JSON.parse(test_cases),
        };
        next();
    },
};
