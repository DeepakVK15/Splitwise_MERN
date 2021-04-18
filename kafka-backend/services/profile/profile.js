"use strict";
const Users = require("../../models/UserModel");

let getUserProfile = async (msg, callback) => {
  Users.find({ email: msg.email }, (error, user) => {
    if (user) {
      callback(null, user);
    }
  });
};

let updateProfile = async (msg, callback) => {
  Users.findOne({ email: msg.email }, (err, user) => {
    if (user) {
      (user.email = msg.email),
        (user.name = msg.name),
        (user.phone = msg.phone),
        (user.timezone = msg.timezone),
        (user.language = msg.language),
        (user.currency = msg.currency);
      user.save();
      callback(null, "Profile updated successfully");
    }
  });
};

exports.getUserProfile = getUserProfile;
exports.updateProfile = updateProfile;
