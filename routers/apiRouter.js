const { Router } = require("express");
const { trainingRouter } = require("./trainingRouter");
const apiRouter = new Router();

apiRouter.use("/training", trainingRouter);

module.exports = { apiRouter };
