const fs = require('fs')
const multer = require('multer')
const appRoot = require('app-root-path')
const path = require("path");
const jwt = require('jsonwebtoken');
const User = require("../../DB/Schemas/users");

global.uploadsDir = path.resolve(appRoot.path, 'uploads')
global.userDir = uploadsDir
// in the request body or in the header should get the id, then creates new directry inside uplodas that eadh dir  realted to eadh training
const storage = multer.diskStorage({
    // TODO: change the dir inside to be first the id of the training
    // like that let userDir = uploadsDir + `/${req.user.id}/${req.body.training.id}`

    destination: function (req, file, cb) {
        // Creates new dir with the current player ID inside the uploads directory
        let userDir = uploadsDir + `/${req.user.id}`
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir)
        }
        cb(null, userDir)
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
        for (const pos in positions) {
            if (positions[pos] < minRequest[pos]) {
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
        console.log('verify', token)
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
    }
}
