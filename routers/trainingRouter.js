const {Router} = require("express");
const trainingRouter = new Router();
const {resultsRouter} = require("./resultsRouter");
const {programsRouter} = require("./ProgramRouter/programsRouter");

trainingRouter.use("/programs", programsRouter);
trainingRouter.use("/results", resultsRouter);

module.exports = {trainingRouter};
