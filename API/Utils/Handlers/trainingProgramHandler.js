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
            userId: req.body.userId ? req.body.userId : null,
        });
        newTraining
            .save()
            .then((docs) => {
                logger.log({
                    level: "info",
                    message: "Successfully added training program",
                });
                res.send("The training program was successfully added");

            })
            .catch((err) => {
                logger.log({
                    level: "Error",
                    message: `Unable to add training program: ${err} `,
                });
                res.sendStatus(400).json(err);

            });
    },

    getTrainingProgram(req, res) {
        const user = req.user
        // 4Find one by user.id
        let filter = {}
        if (req.params.id) {
            filter = {id: req.params.id}
        }
        TrainingProgram.find(filter)
            .then((docs) => {
                logger.log({
                    level: "info",
                    message: "Successfully GET training program",
                });
                res.send(docs)

            })
            .catch((err) => {
                logger.log({
                    level: "Error",
                    message: "Unable to GET training program",
                });
                res.json(err).status(500)

            });
    },
    startTraining(req, res) {
        const minRequest = req.body.minReq;
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
