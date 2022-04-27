const {logger} = require("../logger");
const Users = require("../../../DB/Schemas/users");

exports.coachHandler = {
    addPlayer(req, res) {
        Users.findOne({email: req.body.email})
            .then(docs => {
                if (docs &&  docs.role === 'player') {
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
    }

}