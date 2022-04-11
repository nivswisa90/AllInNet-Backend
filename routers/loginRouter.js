const {Router} = require("express");
const loginRouter = new Router();
const {loginHandler} = require("../API/Utils/Handlers/loginHandler");

loginRouter.post("/signin", loginHandler.login)
loginRouter.post("/adduser", loginHandler.addUser)


module.exports = {loginRouter};