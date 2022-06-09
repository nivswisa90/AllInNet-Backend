const TrainingProgramResult = require("../../../DB/Schemas/trainingResult");
const {v4} = require("uuid");
const {logger} = require("../logger");
const {utils} = require("../utilsFunctions");
const moment = require("moment");

// get Frames imports
const appRoot = require('app-root-path')
const path = require("path");
const fs = require('fs')

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

exports.resultHandler = {
    addTrainingResult(req, res) {
        let successPositions = {
            pos1: parseInt(req.body.successfulThrowPos1),
            pos2: parseInt(req.body.successfulThrowPos2),
            pos3: parseInt(req.body.successfulThrowPos3),
            pos4: parseInt(req.body.successfulThrowPos4),
            pos5: parseInt(req.body.successfulThrowPos5),
            pos6: parseInt(req.body.successfulThrowPos6)
        }
        const minRequestPositions = {
            pos1: req.body.min1,
            pos2: req.body.min2,
            pos3: req.body.min3,
            pos4: req.body.min4,
            pos5: req.body.min5,
            pos6: req.body.min6
        }

        const result = utils.calculateResult(minRequestPositions, successPositions)

        const currentDate = moment().format("MMMM DD YYYY");
        // Go to utils, to   check result(pass/fail)
        const newResult = new TrainingProgramResult({
            id: v4(),
            trainingProgramId: req.body.id,
            playerId: req.user.id,
            title: req.body.title,
            positions: {
                counterPos1: req.body.counterThrowPos1,
                counterPos2: req.body.counterThrowPos2,
                counterPos3: req.body.counterThrowPos3,
                counterPos4: req.body.counterThrowPos4,
                counterPos5: req.body.counterThrowPos5,
                counterPos6: req.body.counterThrowPos6,
                successPos1: req.body.successfulThrowPos1,
                successPos2: req.body.successfulThrowPos2,
                successPos3: req.body.successfulThrowPos3,
                successPos4: req.body.successfulThrowPos4,
                successPos5: req.body.successfulThrowPos5,
                successPos6: req.body.successfulThrowPos6,
                min1: req.body.min1,
                min2: req.body.min2,
                min3: req.body.min3,
                min4: req.body.min4,
                min5: req.body.min5,
                min6: req.body.min6,
            },
            totalThrows: req.body.totalThrows,
            result: result,
            date: currentDate
        });
        newResult
            .save()
            .then(() => {
                logger.log({
                    level: "info",
                    message: "Successfully added training program result",
                });
                res.send("Successfully added training program result");
            })
            .catch((err) => {
                logger.log({
                    level: "info",
                    message: "Unable to add training program result",
                });
                res.status(400).json(err.message);
            });
    },
    getFrame(req, res) {
        // Creates full path to user current dir
        // TODO: change the dir inside to be first the id of the training
        let dir = path.resolve(appRoot.path, 'uploads') + `/${req.params.playerId}/${req.params.trainingProgramId}`
        if (!fs.existsSync(dir)) {
            logger.log({
                level: "info",
                message: `There is no directory name - ${dir}`,
                success: 'false'
            });
            res.send(`There is no directory name - ${dir}`).status(404)
        } else {
            let options = {
                root: dir
            };
            res.setHeader('Content-type', 'image/jpeg')
            res.sendFile(req.params.fileName, options, function (err) {
                if (err) {
                    logger.info({
                        Success: "false",
                        message: `Error while GET frame - ${err}`,
                    })
                } else {
                    logger.info({
                        success: "true",
                        message: `Frame - ${dir + `/${req.params.playerId}`} sent successfully`,
                    });
                }
            })


        }
    },
    getFramesList(req, res) {
        const framesList = []
        let dir = path.resolve(appRoot.path, 'uploads') + `/${req.params.id}`
        if (!fs.existsSync(dir)) {
            logger.log({
                level: "info",
                message: `There is no directory name - ${dir}`,
            });
            res.send(`There is no directory name - ${dir}`).status(404)
        }
            // else {
            //     fs.readdirSync(dir).forEach(frame => framesList.push(frame))
            //     logger.log({
            //         level: "info",
            //         message: `Frame list is ready`,
            //     });
            //     res.json(framesList).status(200)
        // }
        else {
            let trainingId = dir + `/${req.params.trainingProgramId}`
            if (!fs.existsSync(trainingId)) {
                logger.log({
                    level: "info",
                    message: `There is no directory name - ${trainingId}`,
                });
                res.send(`There is no directory name - ${trainingId}`).status(404)
            } else {
                fs.readdirSync(trainingId).forEach(frame => framesList.push(frame))
                logger.log({
                    level: "info",
                    message: `Frame list is ready`,
                });
                res.json(framesList).status(200)
            }
        }

    },
    getTrainingResult(req, res) {
        const filter = {playerId: !req.user.coachPlayers ? req.user.id : req.params.id}
        TrainingProgramResult.find(filter)
            .then((docs) => {
                logger.log({
                    level: "info",
                    message: `GET training results successfully`,
                });
                res.json(docs).status(200)
            }).catch((err) => {
            logger.log({
                level: "info",
                message: `Unable to GET results program: ${err}`,
            });
            res.json(err).status(500);
        })
    },
    getResults(req, res) {
        const start = new Date(req.params.start)
        const end = new Date(req.params.end)

        const allFiltered = {
            positions: {
                counterPos1: 0,
                successPos1: 0,
                min1: 0,
                counterPos2: 0,
                successPos2: 0,
                min2: 0,
                counterPos3: 0,
                successPos3: 0,
                min3: 0,
                counterPos4: 0,
                successPos4: 0,
                min4: 0,
                counterPos5: 0,
                successPos5: 0,
                min5: 0,
                counterPos6: 0,
                successPos6: 0,
                min6: 0
            }
        }

        TrainingProgramResult.find({
            date: {
                $gte: start,
                $lte: end
            },
            playerId: req.params.playerid
        }).then(docs => {
            logger.log({
                level: "info",
                message: `GET training results in date range start - ${start} till - ${end}`,
            });
            docs.map(doc => {
                for (const pos in doc.positions) {
                    allFiltered.positions[pos] += parseInt(doc.positions[pos])
                }
            })
            res.send(allFiltered).status(200)
        }).catch(err => console.log(err))
    }
};
