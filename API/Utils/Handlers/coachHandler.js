const {logger} = require("../logger");
const Users = require("../../../DB/Schemas/users");
const {utils} = require("../utilsFunctions");

exports.coachHandler = {
    addPlayer(req, res) {
        Users.findOne({email: req.body.email})
            .then(docs => {
                if (docs && docs.role === 'player') {
                    Users.findOneAndUpdate({_id: req.user.id}, {$push: {"players": docs._id}}, {new: true})
                        .then(() => {
                            logger.log({
                                level: "info",
                                message: "Successfully added new team player",
                            });
                            res.send("Successfully added new team player")
                        })
                        .catch(err => {
                            logger.log({
                                level: "info",
                                message: "Unable to add team player"
                            });
                            res.status(400).json(err.message);
                        })
                } else {
                    logger.log({
                        level: "info",
                        message: "Player not found",
                    });
                    res.send("Player not found").status(404)
                }
            })
    },

    addProgramToPlayer(req, res) {
        Users.findOneAndUpdate({_id: req.body.id}, {
            $push: {
                "trainingPrograms": {
                    id: req.body.trainingId
                }
            }
        }, {new: true}).then(docs => {
            logger.log({
                level: "info",
                message: `Successfully added new training program to  playerId - ${req.body.id}`,
            });
            res.send(`Successfully added new training program to  playerId - ${req.body.id}`).status(200)
        }).catch(err => {
            logger.log({
                level: "info",
                message: "Unable to add training program player"
            });
            res.status(400).json(err.message)
        })
    },

    // Return an array of player ids
    getTeamPlayers(req, res) {
        const coachPlayers = []
        for (let i = 0; i < req.user.coachPlayers.length; i++) {
            Users.findOne({_id: req.user.coachPlayers[i]}, function (err, player) {
                coachPlayers.push(player)
                if (i === req.user.coachPlayers.length - 1) {
                    res.send(coachPlayers).status(200)
                }
            })
        }
    }
}
