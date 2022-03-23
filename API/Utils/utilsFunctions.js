const fs = require('fs')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        if(!fs.existsSync('./uploads')){
            fs.mkdirSync('./uploads')
        }
        cb(null, './uploads')
    },
    filename: function(req, file, cb){
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
//s

exports.utils = {

    calculateResult(minRequest, positions) {
        const initialValue = 0
        const totalSuccessful = positions.reduce((prev, curr) => prev + curr, initialValue);
        result = minRequest - totalSuccessful 
        return result <= 0 ? "Pass" : "Fail"
    }
}
