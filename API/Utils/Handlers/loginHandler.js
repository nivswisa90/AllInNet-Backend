const Users = require("../../../DB/Schemas/users")
const {logger} = require("../logger");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const privateKey = process.env.PRIVATE_KEY;
const {v4} = require("uuid")

const setUserToken = (id, res, msg) => {
    jwt.sign({id}, privateKey, {expiresIn: 86400}, (err, token) => {
        if (err) {
            logger.log({
                level: "info",
                message: `Authentication error: ${err}`,
            });
            return res.send("Authentication error").status(200)
        }
        logger.log({
            level: "info",
            message: msg,
        });
        res.json({msg: msg, token: token}).status(200)
    })
}


exports.loginHandler = {
    login(req, res) {
        Users.findOne({email: req.body.values.email})
            .then(docs => {
                if (docs) {
                    if (!bcrypt.compareSync(req.body.values.password, docs.password)) {
                        res.json('Wrong user or password')
                    } else {
                        const id = docs.id
                        setUserToken(id, res, "Successfully connected")
                    }
                } else {
                    logger.log({
                        level: "info",
                        message: "User does not exist",
                    });
                    res.json('User does not exist').status(400)

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
                        "id": v4(),
                        "firstName": req.body.values.firstName,
                        "lastName": req.body.values.lastName,
                        "email": req.body.values.email,
                        "password": bcrypt.hashSync(req.body.values.password, 10),
                        "role": req.body.values.role
                    })

                    newUser.save()
                        .then(docs => {
                            setUserToken(docs.id, res, "User successfully registered")
                        })
                        .catch(err => {
                            logger.log({
                                level: "info",
                                message: `Unable to save new user: ${err}`,
                            });
                        });
                }

            })
    },
    getUsers(req, res) {
        let filter = {}
        if (req.params.value)
            filter = req.params.value
        Users.find({"email": {$regex: filter}})
            .then(docs => {
                logger.log({
                    level: "info",
                    message: `Successfully get all player`,
                })
                res.send(docs).status(200)
            }).catch(err => console.log(err))
    },
    getCurrentUser(req, res) {
        Users.find({id: req.user.id})
            .then(docs => {
                logger.log({
                    level: "info",
                    message: `Successfully get current user`,
                })
                const user = {name: docs[0].firstName, id: docs[0].id, role: docs[0].role}
                res.send(user).status(200)
            }).catch(err => console.log(err))
    }
}