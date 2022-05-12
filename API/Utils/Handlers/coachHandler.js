const {logger} = require("../logger");
const Users = require("../../../DB/Schemas/users");
exports.coachHandler = {
    // Coach add player by inserting player's email
    addPlayer(req, res) {
        Users.findOne({email: req.body.email})
            .then(docs => {
                if (docs && docs.role === 'player') {
                    Users.findOneAndUpdate({id: req.user.id},
                        {
                            $push: {"players": docs.id},
                        }, {new: true})
                        .then(() => {
                            logger.log({
                                level: "info",
                                message: "Successfully added new team player",
                            })
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

    // Coach adds a training program to player by inserting player's id and trainingId
    addProgramToPlayer(req, res) {
        Users.findOneAndUpdate({id: req.body.id}, {$push: {"trainingPrograms": req.body.trainingId}}, {new: true})
            .then(docs => {
                logger.log({
                    level: "info",
                    message: `Successfully added new training program to  playerId - ${req.body.id}`,
                })
                res.send(`Successfully added new training program to  playerId - ${req.body.id}`).status(200)
            }).catch(err => {
            logger.log({
                level: "info",
                message: "Unable to add training program player"
            })
            res.status(400).json(err.message)
        })
    },

    // Return an array of player ids
    getTeamPlayers(req, res) {
        const coachPlayers = []
        for (let i = 0; i < req.user.coachPlayers.length; i++) {
            Users.findOne({id: req.user.coachPlayers[i]}, function (err, player) {
                coachPlayers.push({id: player.id, name: player.firstName})
                if (coachPlayers.length === req.user.coachPlayers.length) {
                    res.send(coachPlayers).status(200)
                }
                if (err) {
                    res.send(err).status(400)
                }
            })
        }
    }
}
