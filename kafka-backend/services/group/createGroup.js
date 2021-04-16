"use strict";
const Groups = require("../../models/GroupModel");
const Invite = require("../../models/InviteModel");
const Users = require("../../models/UserModel");
const GroupUsers = require("../../models/GroupUsersModel");
const Activity = require("../../models/RecentActivityModel");

let createGroup = async (msg, callback) => {
  const members = msg.members;
  const createdBy = msg.createdBy;
  const createdBy_name = msg.createdBy_name;
  let res = {};
  let err = "";
  const newgroup = new Groups({
    name: msg.groupname,
    image: null,
  });
  const usergroup = new GroupUsers({
    email: createdBy,
    groupname: msg.groupname,
  });

  Groups.findOne({ name: msg.groupname }, (error, group) => {
    if (error) {
      console.log(error);
    }
    if (group) {
      err = "Group with the same name already exists.";
    } else {
      newgroup.save();
      usergroup.save();
      err = "created group";
      members.forEach((element) => {
        const data = new Invite({
          invite_by: createdBy_name,
          invite_to: element.email,
          groupname: msg.groupname,
        });
        data.save((error, data) => {
          if (error) {
            console.log(error);
          }
        });
      });
      Users.findOne({ email: createdBy }, (err, usr) => {
        const activity = new Activity({
          user: usr._id,
          operation: "created",
          groupname: msg.groupname,
        });
        activity.save((error, data) => {
          if (error) {
            console.log(error);
          } else {
            console.log(data);
          }
        });
      });
    }
    console.log("Creation ", err);
    res.message = err;
    return callback(null, res);
  });
};

let groupMembers = async (msg, callback) => {
  GroupUsers.find({ groupname: msg.name }, (error, members) => {
    if (error) console.log(error);
    else {
      callback(null, members);
    }
  });
};

exports.createGroup = createGroup;
exports.groupMembers = groupMembers;
