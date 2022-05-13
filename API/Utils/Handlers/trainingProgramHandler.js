const TrainingProgram = require("../../../DB/Schemas/trainingProgram");
const {v4} = require("uuid");
const {logger} = require("../logger");
const {exec} = require("child_process");

exports.trainingProgramHandler = {
    async addTraining(req, res) {
        const newTraining = new TrainingProgram({
            id: v4(),
            positions: {
                pos1: req.body.trainingProgram.positions.pos1,
                pos2: req.body.trainingProgram.positions.pos2,
                pos3: req.body.trainingProgram.positions.pos3,
                pos4: req.body.trainingProgram.positions.pos4,
                pos5: req.body.trainingProgram.positions.pos5,
                pos6: req.body.trainingProgram.positions.pos6,
                minReqPos1: req.body.trainingProgram.positions.minReqPos1,
                minReqPos2: req.body.trainingProgram.positions.minReqPos2,
                minReqPos3: req.body.trainingProgram.positions.minReqPos3,
                minReqPos4: req.body.trainingProgram.positions.minReqPos4,
                minReqPos5: req.body.trainingProgram.positions.minReqPos5,
                minReqPos6: req.body.trainingProgram.positions.minReqPos6,
            },
            level: req.body.trainingProgram.level,
            userId: req.body.trainingProgram.userId ? req.body.trainingProgram.userId : null,
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
        if (user) {
            filter = {userId: user.id}
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
        const trainingId = req.body.program.id
        const token = req.headers['x-access-token']

        let minReq = [
            req.body.program.positions.minReqPos1,
            req.body.program.positions.minReqPos2,
            req.body.program.positions.minReqPos3,
            req.body.program.positions.minReqPos4,
            req.body.program.positions.minReqPos5,
            req.body.program.positions.minReqPos6,
        ]

        console.log(token, trainingId, minReq)

        // Call to python with minRequest as parameter or call the DB later in results
        try {
            exec(
                // Need to change the number 3 to be minRequest
                // `ssh -t pi@raspberrypi.local 'cd /home/pi/Desktop/AllInNet-BallModule;export DISPLAY=:0;python3 -m ballmodule ${infos.token}'`,
                `cd /Users/martinmazas/Desktop/AllInNet-BallModule;python3 -m ballmodule ${token} ${trainingId} ${minReq}`,
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
