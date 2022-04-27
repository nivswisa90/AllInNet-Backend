const {Router} = require("express");
const {coachHandler} = require("../API/Utils/Handlers/coachHandler");
const {utils} = require("../API/Utils/utilsFunctions");
const coachRouter = new Router();

coachRouter.post("/addplayer", utils.verifyJWT, coachHandler.addPlayer)


module.exports = {coachRouter};