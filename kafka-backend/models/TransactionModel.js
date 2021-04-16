const mongoose = require('mongoose');
const user = require("./UserModel")
const Schema = mongoose.Schema;

var transactionSchema = new Schema({
    lenderid : {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    borrowerid: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    groupid: {type: String, required: true},
    amount: {type: Number, required: true},
    date: {type: Date }
},
{
    versionKey: false
});

const transactionModel = mongoose.model('transaction', transactionSchema);
module.exports = transactionModel;