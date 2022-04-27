const {Router} = require("express");
const {trainingRouter} = require("./trainingRouter");
const {loginRouter} = require("./loginRouter");
const {coachRouter} = require("./coachRouter");
const apiRouter = new Router();

apiRouter.use("/training",  trainingRouter);
apiRouter.use("/login", loginRouter);
apiRouter.use("/coach", coachRouter);

module.exports = {apiRouter};
