const {Router} = require("express");
const trainingRouter = new Router();
const {resultsRouter} = require("./resultsRouter");
const {programsRouter} = require("./ProgramRouter/programsRouter");
const {utils} = require("../API/Utils/utilsFunctions");

trainingRouter.use("/programs", utils.verifyJWT, programsRouter);
trainingRouter.use("/results", utils.verifyJWT, resultsRouter);

module.exports = {trainingRouter};
