const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    email : {
        type : String,
        unique : true
    },
    password : {
        type : String,
        minLength : 5
    },
    googleId : {
        type : String,
        unique : true
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User