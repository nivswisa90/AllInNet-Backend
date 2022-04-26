const Users = require("../../../DB/Schemas/users")
const {logger} = require("../logger");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const privateKey = process.env.PRIVATE_KEY;


exports.loginHandler = {
    login(req, res) {
        Users.findOne({email: req.body.values.email})
            .then(docs => {
                if (docs) {
                    if (!bcrypt.compareSync(req.body.values.password, docs.password)) {
                        res.json('Wrong user or password');
                    } else {
                        const id = docs._id;
                        // name: docs.firstName,
                        // role: docs.role,
                        jwt.sign({id}, privateKey, {expiresIn: 300}, (err, token) => {
                            if (err) {
                                logger.log({
                                    level: "info",
                                    message: `Authentication error: ${err}`,
                                });
                                return res.send("Authentication error").status(200)
                            }
                            logger.log({
                                level: "info",
                                message: "Successfully connected",
                            });
                            res.json({msg: "Successfully connected", token:token}).status(200)
                        })
                    }
                } else {
                    logger.log({
                        level: "info",
                        message: "User does not exist",
                    });
                    res.json('User does not exist').status(400);

                }
            })
            .catch(err => {
                logger.log({
                    level: "info",
                    message: `Error getting the data from DB: ${err}`,
                });
            });
    },
    addUser(req, res) {
        Users.findOne({email: req.body.values.email})
            .then(docs => {
                if (docs) {
                    res.send("User already registered").status(200)
                    logger.log({
                        level: "info",
                        message: `User already registered`,
                    });
                } else {
                    const newUser = new Users({
                        "firstName": req.body.values.firstName,
                        "lastName": req.body.values.lastName,
                        "email": req.body.values.email,
                        "password": bcrypt.hashSync(req.body.values.password, 10),
                        "role": req.body.values.role
                    })
                    newUser.save()
                        .then(docs => {
                            logger.log({
                                level: "info",
                                message: "User successfully registered",
                            });
                            res.send("User successfully registered").status(200)
                        })
                        .catch(err => {
                            logger.log({
                                level: "info",
                                message: `Unable to save new user: ${err}`,
                            });
                        });
                }

            })
    }


}