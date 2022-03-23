const fs = require('fs')
const multer = require('multer')
const appRoot = require('app-root-path')
const path = require("path");

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
        const initialValue = 0
        const totalSuccessful = positions.reduce((prev, curr) => prev + curr, initialValue);
        result = minRequest - totalSuccessful
        return result <= 0 ? "Pass" : "Fail"
    }
}
