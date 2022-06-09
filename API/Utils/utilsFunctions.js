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
        let trainingId = userDir + `/${req.headers["programid"]}`
        if(!fs.existsSync(trainingId)){
            fs.mkdirSync(trainingId)
        }
        cb(null, trainingId)
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
    getMinimumRequestFromPercentage(positions) {
        const min1 = Math.round(parseInt(positions.minReqPos1) * parseInt(positions.pos1) / 100)
        const min2 = Math.round(parseInt(positions.minReqPos2) * parseInt(positions.pos2) / 100)
        const min3 = Math.round(parseInt(positions.minReqPos3) * parseInt(positions.pos3) / 100)
        const min4 = Math.round(parseInt(positions.minReqPos4) * parseInt(positions.pos4) / 100)
        const min5 = Math.round(parseInt(positions.minReqPos5) * parseInt(positions.pos5) / 100)
        const min6 = Math.round(parseInt(positions.minReqPos6) * parseInt(positions.pos6) / 100)

        return {min1, min2, min3, min4, min5, min6}
    },
    calculateResult(minRequest, success) {
        let positionPercentage = 0
        let totalResult = []
        // First calculate for each position the % of success throws,
        // from the minimum requested amount of throws
        for (const pos in success) {
            positionPercentage = Math.floor(parseInt(success[pos])/parseInt(minRequest[pos])*100)
            totalResult.push({pos:positionPercentage})
        }
        // Then calculate the average percentage of all the positions
        let totalPercentage = 0
        totalResult.map(res =>{
            totalPercentage += parseInt(res.pos)
        })
        return String(Math.floor(totalPercentage/totalResult.length)) + '%'
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
