const GroupUsers = require("../../models/GroupUsersModel");
const Invite = require("../../models/InviteModel");

let acceptInvite = async(msg, callback) => {
    let message;
    const user = new GroupUsers({
        email: msg.invite_to,
        groupname: msg.group,
      });
      Invite.deleteOne(
        { invite_to: msg.invite_to },
        { groupname: msg.group },
        (error, invite) => {
          if (error) callback(error,null);
          else {
            user.save();
          }
        }
      );
      message = "Accepted";
      callback(null, message);
}

let rejectInvite = async(msg, callback) => {
  Invite.deleteOne(
    { invite_to: msg.invite_to },
    { groupname: msg.group },
    (error, invite) => {
      if (error) console.log(error);
      else {
        console.log("invite rejected");
      }
    }
  );
  callback(null, "Rejected");
}

let invites = async(msg, callback) => {
    Invite.find({ invite_to: msg.invite_to }, (error, invites) => {
        if (error) {
          console.log("Error,", error);
          callback(error, null);
        } else {
          console.log("invites ", JSON.stringify(invites));
          callback(null, invites);
        }
      });
}

exports.acceptInvite = acceptInvite;
exports.rejectInvite = rejectInvite;
exports.invites = invites;