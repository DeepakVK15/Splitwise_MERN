const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var groupUsersSchema = new Schema({
    email : {type: String, required: true},
    groupname: {type: String, required: true }
},
{
    versionKey: false
});

const groupUsersModel = mongoose.model('groupusers', groupUsersSchema);
module.exports = groupUsersModel;