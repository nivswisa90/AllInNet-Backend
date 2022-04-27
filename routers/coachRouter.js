const {Router} = require("express");
const {coachHandler} = require("../API/Utils/Handlers/coachHandler");
const {utils} = require("../API/Utils/utilsFunctions");
const coachRouter = new Router();

coachRouter.post("/addplayer", utils.verifyJWT, coachHandler.addPlayer)
coachRouter.post("/addtraining", utils.verifyJWT, coachHandler.addProgramToPlayer)


module.exports = {coachRouter};