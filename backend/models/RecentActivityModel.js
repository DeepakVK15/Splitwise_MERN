const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var activitySchema = new Schema({
    user : {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    operation:  {type: String, required: true},
    groupname:  {type: String, required: true},
    amount:  {type: Number},
    date:  {type: Date, default: Date.now},
    description: {type:String }
},
{
    versionKey: false
});

const activityModel = mongoose.model('activity', activitySchema);
module.exports = activityModel;