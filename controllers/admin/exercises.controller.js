const { Exercise, TestCase } = require("../../models");
const { runEXE } = require("../../modules/compiler");

module.exports = {
    updateHandle: async (req, res, next) => {
        const { id } = req.params;
        const { test_cases, exePath, ...body } = res.locals.body;
        const { errors } = res.locals;

        if (errors.length) return res.render("admin/exercises/exercise");

        await Exercise.updateOne({ _id: id }, { $set: body });

        if (test_cases && test_cases.length) {
            await TestCase.deleteMany({ exercise: id });

            for (let i = 0; i < test_cases.length; i++) {
                const { stdout } = await runEXE(exePath, test_cases[i].input.match(/(?<=(['"])\b)(?:(?!\1|\\).|\\.)*(?=\1)/g), null);
                test_cases[i] = {
                    ...test_cases[i], exercise: id, index: i, output: stdout,
                };
            }
            await TestCase.create(test_cases);
        }
        res.redirect(`/admin/exercises/${ id }/update`);
    }, updatePage: async (req, res, next) => {
        const { id } = req.params;

        const exercise = await Exercise.findOne({ _id: id });

        if (!exercise) return next();

        // @ts-ignore
        exercise.test_cases = await TestCase.getByExercise(exercise._id);

        res.locals.body = exercise;
        // @ts-ignore
        res.locals.seo.title = "Cập nhật " + exercise.name;

        res.render("admin/exercises/exercise");
    }, deleteHandle: async (req, res) => {
        const { id } = req.params;

        await Exercise.updateOne({ _id: id }, { $set: { is_delete: true } });
    },
};
