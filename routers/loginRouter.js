const {Router} = require("express");
const loginRouter = new Router();
const {loginHandler} = require("../API/Utils/Handlers/loginHandler");

loginRouter.post("/signin", loginHandler.login)
loginRouter.post("/adduser", loginHandler.addUser)
loginRouter.get("/users", loginHandler.getUsers)


module.exports = {loginRouter};