const {Router} = require("express");
const {coachHandler} = require("../API/Utils/Handlers/coachHandler");
const {utils} = require("../API/Utils/utilsFunctions");
const coachRouter = new Router();

coachRouter.post("/addplayer", utils.verifyJWT, coachHandler.addPlayer)
coachRouter.get("/players", utils.verifyJWT, coachHandler.getTeamPlayers)


module.exports = {coachRouter};