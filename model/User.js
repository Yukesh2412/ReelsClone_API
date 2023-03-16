const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id : {
        type : String,
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    username : {
        type : String,
    },
    profile_pic : {
        type : String,
    }
})

module.exports = mongoose.model('Users', userSchema);