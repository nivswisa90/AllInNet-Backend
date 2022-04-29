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

    // Returns a player info
    async getPlayerInfo(playerId) {
        console.log('playerid', playerId)

        await Users.findOne({_id: playerId})
            .then(player => {
                if (player)
                    return player
                return []
            })
            .catch(err => {
                logger.error("Unable to fetch player information", {"id": playerId, "success": false, "error": err})
                return []
            })
    },

    getPlayersInfo(playerIds) {
        let players = []
        console.log("here!")
        playerIds.forEach(async function (playerId) {
            players.push(await this.getPlayerInfo(playerId))
        })
        return players
    },


    // Return an array of player ids
    async getTeamPlayers(req, res) {
        // Get the coach only
        console.log(req.user.id)
        let playerIds = await Users.findOne({_id: req.user.id})
            .then(coach => {
                logger.info(`Successfully got all team player`);
                // here we have the array of ids of players
                return coach.players
            })
            .catch(err => {
                logger.error("Error fetching coach players", {"error": err})
            })
        if(playerIds){
            let players = module.exports.getPlayersInfo(playerIds)
            console.log(players)
            res.send()
        }
        else
            res.sendStatus(500)
    }
    //         coach.players.map(player => {
    //             // Get the info of the current player
    //             Users.find({_id: player.id})
    //                 .then(result => {
    //                     console.log("result", result)
    //                     teamPlayers.push(result)
    //                 }).catch(err => res.send(err))
    //             console.log('atthe end', teamPlayers)
    //         })
    //         console.log('after all', teamPlayers)
    //         res.json(teamPlayers)
    //         // res.send(teamPlayers).status(200)
    //     }).catch(err => {
    //     logger.log({
    //         level: "info",
    //         message: "Unable to add training program player"
    //     });
    //     res.status(400).json(err.message)
    // })
}