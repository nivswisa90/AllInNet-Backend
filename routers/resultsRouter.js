const {Router} = require("express");
const multer = require("multer");
const {resultHandler} = require("../API/Utils/Handlers/programResultsHandler");
const resultsRouter = new Router();

resultsRouter.get("/trainingResult/:id?", resultHandler.getTrainingResult)
resultsRouter.post("/", resultHandler.addTrainingResult)
resultsRouter.get('/frameslist/:id/:trainingProgramId', resultHandler.getFramesList)
resultsRouter.get('/frames/:playerId/:trainingProgramId/:fileName', resultHandler.getFrame)
resultsRouter.get('/:playerid?/:start/:end', resultHandler.getResults)
resultsRouter.post('/upload', (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.status(500).send({error: {message: `Multer uploading error: ${err.message}`}}).end();
            return;
        } else if (err) {
            // An unknown error occurred when uploading.
            if (err.name === 'ExtensionError') {
                res.status(413).send({error: {message: err.message}}).end();
            } else {
                res.status(500).send({error: {message: `unknown uploading error: ${err.message}`}}).end();
            }
            return;
        }
        res.status(200).end('Your files were uploaded.');
    })
});


module.exports = {resultsRouter};
