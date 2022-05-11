const {Router} = require("express");
const loginRouter = new Router();
const {loginHandler} = require("../API/Utils/Handlers/loginHandler");
const {utils} = require("../API/Utils/utilsFunctions");

loginRouter.post("/signin", loginHandler.login)
loginRouter.post("/adduser", loginHandler.addUser)
loginRouter.get("/user", utils.verifyJWT,  loginHandler.getCurrentUser)
loginRouter.get("/users", utils.verifyJWT,  loginHandler.getUsers)



module.exports = {loginRouter};