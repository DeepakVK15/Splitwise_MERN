const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var groupSchema = new Schema({
    name : {type: String, required: true},
    image: { data: Buffer, contentType: JSON }
},
{
    versionKey: false
});

const groupModel = mongoose.model('group', groupSchema);
module.exports = groupModel;