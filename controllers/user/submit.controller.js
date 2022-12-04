const { TestCase, History } = require("../../models");
const { run } = require("../../modules/compiler");
const { EHistoryType } = require("../../utils/types");
const { THRESHOLD } = require("../../utils/constaints");

module.exports = {
    run: async (req, res, next) => {
        const { id } = req.params;
        const { testcases, source, history, user, type, exercise } =
            res.locals;
        try {
            res.locals.seo.title = exercise.name;
            const { result, correctAll } = await run(source, testcases);

            if (!correctAll && type == EHistoryType.submit) {
                const submitHistory = await History.findOne({
                    type: "SUBMIT",
                    user: user.id,
                    exercise: exercise.id,
                });
                const testHistory = await History.findOne({
                    user: user.id,
                    exercise: exercise.id,
                    type: "TEST",
                });

                res.locals.test_remaining =
                    THRESHOLD.TEST - (testHistory ? testHistory.times : 0);

                res.locals.submit_remaining =
                    THRESHOLD.SUBMIT -
                    (submitHistory ? submitHistory.times : 0);

                res.locals.exercise.testcases =
                    res.locals.exercise.testcases.map((e, i) => {
                        return { ...result[i], ...e };
                    });

                throw new Error("Nộp bài thất bại! bài giải chưa đúng");
            }

            if (history) {
                await History.updateOne(
                    { _id: history._id },
                    { $inc: { times: 1 } }
                );
            } else {
                await History.create({
                    exercise: id,
                    user: user._id,
                    type,
                });
            }

            if (type == EHistoryType.submit) {
                return res.redirect("/");
            } else return res.json({ success: true, data: result });
        } catch (err) {
            if (type == EHistoryType.submit) {
                res.locals.errors.push(err.message);
                res.render("user/lesson/submit");
            } else res.json({ success: false, message: err.message });
        }
    },
    submit: async (req, res, next) => {
        const { id } = req.params,
            { source } = req.body,
            { user, history } = res.locals;
        try {
            const testcases = await TestCase.find({ exercise: id });
            if (!history) {
                throw new Error("SUBMITTED");
            } else {
                await History.create({
                    exercise: id,
                    user: user._id,
                    type: "SUBMIT",
                });
            }

            const { result } = await run(source, testcases);
        } catch (err) {
            res.json({ success: false, message: err.message });
        }
    },
};
