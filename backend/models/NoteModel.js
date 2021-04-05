const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var noteSchema = new Schema({
    expense :{type: mongoose.Schema.Types.ObjectId, ref: "expense"},
    user:  {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    date:  {type: Date, default: Date.now},
    note: {type:String}
},
{
    versionKey: false
});

const noteModel = mongoose.model('note', noteSchema);
module.exports = noteModel;