const TrainingProgramResult = require("../../../DB/Schemas/trainingResult");
const {v4} = require("uuid");
const {logger} = require("../logger");
const {utils} = require("../utilsFunctions");
const moment = require("moment");
const fs = require('fs');
const path = require('path');
const TrainingProgram = require("../../../DB/Schemas/trainingProgram");


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
                successPos6: req.body.successfulThrowPos6
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

    saveImages(req, res) {
        logger.log({
            level: "info",
            message: "Successfully saved images",
        });
        res.json('done')
    },

    getTrainingResult(req, res) {
        let filter = {};
        if (req.body.id) {
            filter = {playerId: req.body.id}
        } else {
            filter = {playerId: req.user.id}
        }
        TrainingProgramResult.find(filter)
            .then((docs) => {
                logger.log({
                    level: "info",
                    message: `GET training programs successfully`,
                });
                res.json(docs).status(200)
            }).catch((err) => {
            logger.log({
                level: "info",
                message: `Unable to GET training program: ${err}`,
            });
            res.json(err).status(500);
        })
    },
};
