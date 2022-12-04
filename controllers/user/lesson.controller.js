// @ts-nocheck
const { Lesson, Exercise, History } = require("../../models");
const { THRESHOLD } = require("../../utils/constaints");
module.exports = {
    getLesson: async (req, res, next) => {
        const { id } = req.params;
        const lesson = await Lesson.get(id);
        if (!lesson) return next();

        res.locals.lesson = lesson;
        res.locals.seo.title = lesson.name;

        res.render("user/lesson");
    },
    getExercise: async (req, res, next) => {
        const { id, exercise } = req.params;
        const { user } = res.locals;

        const exerciseData = await Exercise.get(exercise);

        const submitHistory = await History.findOne({
            type: "SUBMIT",
            user: user.id,
            exercise,
        });
        const testHistory = await History.findOne({
            user: user.id,
            exercise,
            type: "TEST",
        });

        if (!exerciseData) return next();

        res.locals.seo.title = exerciseData.name;
        res.locals.exercise = exerciseData;

        res.locals.test_remaining =
            THRESHOLD.TEST - (testHistory ? testHistory.times : 0);

        res.locals.submit_remaining =
            THRESHOLD.SUBMIT - (submitHistory ? submitHistory.times : 0);

        res.render("user/lesson/submit");
    },
};
