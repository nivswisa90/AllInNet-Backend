const TrainingProgram = require("../../../DB/Schemas/trainingProgram");
const {v4} = require("uuid");
const {logger} = require("../logger");
const {exec} = require("child_process");

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
            filter = {id: req.params.id};
        }
        TrainingProgram.find(filter)
            .then((docs) => {
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
                    message: "Unable to GET training program",
                });
            });
    },
    startTraining(req, res) {
        const minRequest = req.body.minReq;
        console.log('dsadsad', minRequest)
        // Call to python with minRequest as parameter or call the DB later in results
        try {
            exec(
                // Need to change the number 3 to be minRequest
                `ssh -t pi@192.168.1.13 'cd /home/pi/Desktop/AllInNet-BallModule ;export DISPLAY=:0;python3 -m  ballmodule ${minRequest}'`,
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
            res.send("The Ball module done his JOB!");
        } catch (err) {
            logger.log({
                level: "info",
                message: "Unable to run Ball Module",
            });
        }


    },
    endTraining(req, res) {
        // Stop python
    },
};
