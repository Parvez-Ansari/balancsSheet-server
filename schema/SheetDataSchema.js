const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let sheetSchema = new mongoose.Schema({
    "description": String,
    "type": String,
    "amount": String,
    "uniqueID": String
})
// sheet data moedl

let Rowdata = mongoose.model("Rowdata", sheetSchema)
module.exports = Rowdata;