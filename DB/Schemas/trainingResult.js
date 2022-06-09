const {Schema, model} = require("mongoose");

const trainingProgramResultSchema = new Schema({
    id: {type: String, required: true},
    title: {type: String},
    trainingProgramId: {type: String},
    playerId: {type: String},
    positions: {type: Object},
    result: {type: String},
    date: {type: Date},
});
const TrainingProgramResult = model(
    "trainingresult",
    trainingProgramResultSchema
);
module.exports = TrainingProgramResult;
