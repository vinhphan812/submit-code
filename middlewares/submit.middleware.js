const { TestCase, History, Exercise } = require("../models");
const { EHistoryType } = require("../utils/types");
const { THRESHOLD } = require("../utils/constaints");
module.exports = {
    submitMiddleware: async (req, res, next) => {
        const { id, type } = req.params,
            { source } = req.body,
            { user } = res.locals;

        if (!source)
            return res.json({ success: false, message: "SOURCE_IS_NOT_REQUIRED" });

        if (!type)
            return res.json({ success: false, message: "TYPE_IS_NOT_REQUIRED" });

        if (!Object.keys(EHistoryType).includes(type))
            return res.json({ success: false, message: "TYPE_INVALID" });

        const exercise = await Exercise.get(id);

        if (!exercise)
            return res.json({ success: false, message: "EXERCISE_INVALID" });

        const history = await History.findOne({ exercise: id, user: user.id, type: EHistoryType[type] });

        if (history && history.times >= THRESHOLD[history.type])
            return res.json({ success: false, message: "SOLD_OUT" });

        res.locals.testcases = exercise.testcases;
        res.locals.source = source;
        res.locals.exercise = exercise;
        res.locals.history = history;
        res.locals.type = EHistoryType[type];

        next();
    }
}