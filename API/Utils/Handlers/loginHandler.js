const Users = require("../../../DB/Schemas/users")
const { logger } = require("../logger");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const privateKey = process.env.PRIVATE_KEY;


exports.loginHandler = {
    login(req, res) {
        Users.findOne({ email: req.body.values.email })
            .then(docs => {
                if (docs) {
                    if (!bcrypt.compareSync(req.body.values.password, docs.password)) {
                        res.json('Wrong user or password');
                    }
                    else {
                        const id = docs._id;
                        const token = jwt.sign({ id }, privateKey);
                        // res.cookie('token', token, { maxAge: 6000000, sameSite: 'none', secure: true });
                        res.json({ msg: "Successfully connected", token: token }).status(200);
                    }
                }
                else {
                    res.json('User does not exist').status(400);
                }
            })
            .catch(err => console.log(`Error getting the data from DB: ${err}`));
    },
    addUser(req, res) {
        const newUser = new Users({
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "password": bcrypt.hashSync(req.body.password, 10),
            "role": req.body.role
        })
        newUser.save()
            .then(docs => res.send(docs).status(200))
            .catch(err => console.log(err));
    }
}