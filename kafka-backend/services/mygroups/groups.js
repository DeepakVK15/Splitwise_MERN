"use strict";
const GroupUsers = require("../../models/GroupUsersModel");

let groups = async(msg, callback) => {
    const result = [];
    GroupUsers.find({ email: msg.email}, (error, groups) => {
      if (error) {
        console.log("Error", error);
        callback(error, null);
      } else {
        for (var i = 0; i < groups.length; i++) {
          result.push(groups[i].groupname);
        }
        console.log("Result ",result);
        callback(null, result)
      }
    });
}

exports.groups = groups;