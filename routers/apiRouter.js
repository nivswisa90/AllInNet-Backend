const {Router} = require("express");
const {trainingRouter} = require("./trainingRouter");
const {loginRouter} = require("./loginRouter");
const apiRouter = new Router();

apiRouter.use("/training",  trainingRouter);
apiRouter.use("/login", loginRouter);

module.exports = {apiRouter};
