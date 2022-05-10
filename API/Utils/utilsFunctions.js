const fs = require('fs')
const multer = require('multer')
const appRoot = require('app-root-path')
const path = require("path");
const jwt = require('jsonwebtoken');
const User = require("../../DB/Schemas/users");

global.uploadsDir = path.resolve(appRoot.path, 'uploads')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir)
        }
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

global.upload = multer({
    storage: storage,
    limits: {
        fieldNameSize: 300,
        fileSize: 1000000000
    }
}).array('multi-files')


exports.utils = {

    calculateResult(minRequest, positions) {
        for(const pos in positions) {
            if(positions[pos] < minRequest[pos]) {
                return "Fail"
            }
        }
        return "Pass"
        // const initialValue = 0
        // const totalSuccessful = positions.reduce((prev, curr) => prev + curr, initialValue);
        // let result = minRequest - totalSuccessful
        // return result <= 0 ? "Pass" : "Fail"
    },

    verifyJWT(req, res, next) {
        const token = req.headers["x-access-token"]

        if (token) {
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
                if (err) return res.status(401).json({
                    isLoggedIn: false,
                    message: 'Failed to authenticate'
                })
                req.user = {};
                req.user.id = decoded.id
                User.findOne({id: decoded.id})
                    .then(user => {
                        user.role === 'coach' ? req.user.coachPlayers = user.players : null
                        next()
                    }).catch(err => console.log(err))
            })
        } else {
            res.json({message: "Incorrect Token Given", isLoggedIn: false})
        }
    },

    arrangeTeamPlayers(players) {

    }
}
