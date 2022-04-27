const {logger} = require("../logger");
const Users = require("../../../DB/Schemas/users");
const {utils} = require("../utilsFunctions");

exports.coachHandler = {
    addPlayer(req, res) {
        Users.findOne({email: req.body.email})
            .then(docs => {
                if (docs && docs.role === 'player') {
                    Users.findOneAndUpdate({_id: req.user.id}, {
                            $push: {
                                "players": {
                                    id: docs._id
                                }
                            }
                        },
                        {new: true})
                        .then(docs => {
                            logger.log({
                                level: "info",
                                message: "Successfully added new team player",
                            });
                            res.send("Successfully added new team player").status(200)
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

    getTeamPlayers(req, res) {
        const teamPlayers = []
        Users.find({_id: req.user.id})
            .then(async docs => {
                logger.log({
                    level: "info",
                    message: `Successfully get all team player`,
                });
                // teamPlayers = utils.arrangeTeamPlayers(docs[0].players)
                const  resu = docs[0].players.map(async doc => {
                    await Users.findOne({_id: doc.id})
                        .then(result => {
                            console.log("results", result[0])
                            teamPlayers.push(result[0])
                        }).catch(err => res.send(err))
                    return teamPlayers
                })
                if(resu)
                    res.json(resu)
                // console.log(teamPlayers)

                // res.send(teamPlayers).status(200)
            }).catch(err => {
            logger.log({
                level: "info",
                message: "Unable to add training program player"
            });
            res.status(400).json(err.message)
        })
    },


}