const multer = require('multer')

const fileData = {
    destination: function(request, file, callback){
        callback(null, 'uploads')
    },
    filename: function (request, file, callback){
        callback(null, `${file.fieldname}-${Date.now()}`)
    }
}

const storage = multer.diskStorage(fileData)

const upload = multer({ storage:storage })

module.exports = upload

