const TrainingProgram = require("../../../DB/Schemas/trainingProgram");
const { v4 } = require("uuid");
const { logger } = require("../logger");
const { exec } = require("child_process");

exports.trainingProgramHandler = {
  async addTraining(req, res) {
    const newTraining = new TrainingProgram({
      id: v4(),
      positions: {
        pos1: req.body.positions.pos1,
        pos2: req.body.positions.pos2,
        pos3: req.body.positions.pos3,
        pos4: req.body.positions.pos4,
        pos5: req.body.positions.pos5,
      },
      minimumRequest: req.body.minimumRequest,
      level: req.body.level,
    });
    newTraining
      .save()
      .then((docs) => {
        res.send("The training program was successfully added");
        logger.log({
          level: "info",
          message: "Successfully added training program",
        });
      })
      .catch((err) => {
        res.sendStatus(400).json(err);
        logger.log({
          level: "Error",
          message: "Uanble to add training program",
        });
      });
  },

  getTrainingProgram(req, res) {
    let filter = {};
    if (req.params.id) {
      filter = { id: req.params.id };
    }
    console.log(filter);
    console.log(typeof filter);
    TrainingProgram.find(filter)
      .then((docs) => {
        console.log(docs);
        res.send(docs);
        logger.log({
          level: "info",
          message: "Successfully GET training program",
        });
      })
      .catch((err) => {
        res.json(err).status(500);
        logger.log({
          level: "Error",
          message: "Uanble to GET training program",
        });
      });
  },
  startTraining(req, res) {
    const minRequest = req.body.minRequest.minReq;
    // Call to python with minRequest as parameter or call the DB later in results

    exec(
      // Need to change the number 3 to be minRequest
      `ssh -t root@195.181.240.98 'cd /root/FinalProject/All-In-Net/BallModule ;export DISPLAY=:0;python3 -m  BallModule ${minRequest}'`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      }
    );
  },
  endTraining(req, res) {
    // Stop python
  },
};
