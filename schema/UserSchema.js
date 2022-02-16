const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let userSchema = new mongoose.Schema({
    "firstName": String,
    "lastName": String,
    "email": String,
    "password": String,
    "uniqueID": String
})

let User = mongoose.model("User", userSchema)

module.exports = User;