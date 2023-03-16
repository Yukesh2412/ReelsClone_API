const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    video_id : {
        type : String,
    },
    category : {
        type : String,
        required : true
    },
    filename : {
        type: String,
    },
    user_id : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('Videos', videoSchema);


