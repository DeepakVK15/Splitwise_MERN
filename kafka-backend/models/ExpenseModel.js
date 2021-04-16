const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var expenseSchema = new Schema({
    description : {type: String, required: true},
    paid_by: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    group_name:  {type: String, required: true},
    amount:  {type: Number, required: true},
    date:  {type: Date, default: Date.now},
},
{
    versionKey: false
});

const expenseModel = mongoose.model('expense', expenseSchema);
module.exports = expenseModel;