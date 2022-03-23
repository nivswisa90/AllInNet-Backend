const { Router } = require("express");
const programsRouter = new Router();
const {
  trainingProgramHandler,
} = require("../../API/Utils/Handlers/trainingProgramHandler");

programsRouter.get("/:id?", trainingProgramHandler.getTrainingProgram);
programsRouter.post("/", trainingProgramHandler.addTraining);
programsRouter.post("/start", trainingProgramHandler.startTraining);

module.exports = { programsRouter };
