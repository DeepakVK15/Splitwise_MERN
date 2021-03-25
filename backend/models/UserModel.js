const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
},
{
    versionKey: false
});

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;