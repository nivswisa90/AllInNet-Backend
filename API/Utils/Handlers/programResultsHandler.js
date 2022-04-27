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
        // currentDate = new Date();
        currentDate = moment().format("MMMM DD YYYY");
        // Go to utils, to   check result(pass/fail)
        const successPositions = [
            success1 = parseInt(req.body.successfulThrowPos1),
            success2 = parseInt(req.body.successfulThrowPos2),
            success3 = parseInt(req.body.successfulThrowPos3),
            success4 = parseInt(req.body.successfulThrowPos4),
            success5 = parseInt(req.body.successfulThrowPos5)
        ]

        let result = utils.calculateResult(parseInt(req.body.minRequest), successPositions)

        const newResult = new TrainingProgramResult({
            id: v4(),
            trainingProgramId: req.body.id,
            playerId: req.body.playerId,
            positions: {
                counterPos1: req.body.counterThrowPos1,
                counterPos2: req.body.counterThrowPos2,
                counterPos3: req.body.counterThrowPos3,
                counterPos4: req.body.counterThrowPos4,
                counterPos5: req.body.counterThrowPos5,
                successPos1: req.body.successfulThrowPos1,
                successPos2: req.body.successfulThrowPos2,
                successPos3: req.body.successfulThrowPos3,
                successPos4: req.body.successfulThrowPos4,
                successPos5: req.body.successfulThrowPos5,
            },
            totalThrows: req.body.totalThrows,
            result: result,
            date: currentDate,
            minRequest: req.body.minRequest
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
                    level: "Error",
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
        // filter = {playerId: req.user.id}
        if(req.body.id){
            filter = {playerId: req.body.id}
        }else{
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
