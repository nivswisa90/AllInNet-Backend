const { Router } = require("express");
const executeRouter = new Router();
const {
  trainingProgramHandler,
} = require("../../API/Utils/Handlers/trainingProgramHandler");

// executeRouter.get("/:id?", trainingProgramHandler.getTrainingProgram);
executeRouter.post("/start", trainingProgramHandler.startTraining);
executeRouter.post("/end", trainingProgramHandler.endTraining);

module.exports = { executeRouter };
