const { Schema, model } = require("mongoose");

const trainingProgramResultSchema = new Schema({
  id: { type: String, required: true },
  trainingProgramId: { type: String },
  playerId: { type: String },
  positions: { type: Object },
  totalThrows: { type: Number },
  result: { type: String },
  date: { type: String },
  minRequest: { type: Number }
});
const TrainingProgramResult = model(
  "trainingresult",
  trainingProgramResultSchema
);
module.exports = TrainingProgramResult;
