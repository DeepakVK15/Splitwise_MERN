const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var inviteSchema = new Schema({
    invite_by : {type: String, required: true},
    invite_to:  {type: String, required: true},
    groupname:  {type:String, required: true}
},
{
    versionKey: false
});

const inviteModel = mongoose.model('invite', inviteSchema);
module.exports = inviteModel;