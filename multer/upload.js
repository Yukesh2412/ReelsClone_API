const multer = require('multer');

const storage = multer.diskStorage({
    destination : async function(req, file, cb){
        cb(null, './uploads')
    },
    filename : function(req, file, cb){
        let randomString = generateRandomChar();
        let name = Date.now() + randomString + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]
        cb(null, name);
    }
});

var upload = multer({
    storage : storage,
    limits : {fileSize : 50000000 },
    fileFilter : function (req, file, callback){
        if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) { 
            return cb(new Error('Please upload a video'))
         }
         callback(null, true);
    }
}).single('video');



function generateRandomChar() {
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var result = ""
    var chaactersLength = characters.length;
    for (var i = 0; i < 7; i++) {
        result += characters.charAt(Math.floor(Math.random() * chaactersLength));
    }
    return result;
}

module.exports = upload;