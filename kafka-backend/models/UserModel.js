const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name : {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phone: {type: String, required: false},
    currency: {type: String, required: true},
    language: {type: String, required: true},
    timezone: {type: String, required: true}
},
{
    versionKey: false
});

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;