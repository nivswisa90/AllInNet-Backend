const {Router} = require("express");
const loginRouter = new Router();
const {loginHandler} = require("../API/Utils/Handlers/loginHandler");

loginRouter.post("/", loginHandler.getToken);


module.exports = {loginRouter};
