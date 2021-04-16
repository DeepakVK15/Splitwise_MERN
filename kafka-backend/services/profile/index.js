"use strict";
const { getUserProfile, updateProfile } = require("./profile");

function handle_request(message, callback) {
    switch (message.route) {
      case "getUserProfile":
        getUserProfile(message, callback);
        break;
    case "updateProfile":
        updateProfile(message, callback);
        break;
    }
}

exports.handle_request = handle_request;



