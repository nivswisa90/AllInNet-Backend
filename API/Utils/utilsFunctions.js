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
    },
    calculateTrainingLevel(positions){
        // Hard - Positions 1 and 5, more than 10 minimum request in each one
        // Medium - All positions, if the more the 10 minimum request in each one
        // Easy - All position, less than 10 minimum request in each one
        if(positions.minReqPos1 >= 15 || positions.minReqPos5 >= 15){
            if(positions.minReqPos2 >= 10 && positions.minReqPos3 >= 10 && positions.minReqPos4 >= 10 ){
                return 'Hard'
            }
            return 'Medium'
        }
        else if(positions.minReqPos1 >= 10 && positions.minReqPos2 >= 10 && positions.minReqPos3 >= 10 && positions.minReqPos4 >= 10 && positions.minReqPos5 >= 10 ){
            return 'Medium'
        }
        else{
            return 'Easy'
        }
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
    }
}
