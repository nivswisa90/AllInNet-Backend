const {Schema, model} = require("mongoose");

const trainingProgramSchema = new Schema({
    id: {type: String, required: true},
    positions: {type: Object},
    level: {type: String},
    userId: {type: String}
});
const TrainingProgram = model("trainingprogram", trainingProgramSchema);
module.exports = TrainingProgram;
