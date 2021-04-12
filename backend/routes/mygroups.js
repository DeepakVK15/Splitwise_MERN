var express = require("express");
const router = express.Router();
const Invite = require("../models/InviteModel");
const GroupUsers = require("../models/GroupUsersModel");

router.get("/", (req, res) => {
  const result = [];
  GroupUsers.find({ email: req.query.email}, (error, groups) => {
    if (error) {
      console.log("Error", error);
    } else {
      for (var i = 0; i < groups.length; i++) {
        result.push(groups[i].groupname);
      }
      console.log("Result ",result);
      res.send(result);
    }
  });
});

router.get("/invites", (req, res) => {
  Invite.find({ invite_to: req.query.invite_to }, (error, invites) => {
    if (error) {
      console.log("Error,", error);
      res.end("Error Occured");
    } else {
      console.log("invites ", JSON.stringify(invites));
      res.send(invites);
    }
  });
});

router.post("/acceptInvite", (req, res) => {
  const user = new GroupUsers({
    email: req.body.invite_to,
    groupname: req.body.group,
  });
  Invite.deleteOne(
    { invite_to: req.body.invite_to },
    { groupname: req.body.group },
    (error, invite) => {
      if (error) console.log(error);
      else {
        user.save();
      }
    }
  );
  res.send("Accepted");
});

router.post("/rejectInvite", (req, res) => {
  Invite.deleteOne(
    { invite_to: req.body.invite_to },
    { groupname: req.body.group },
    (error, invite) => {
      if (error) console.log(error);
      else {
        console.log("invite rejected");
      }
    }
  );
  res.send("Rejected");
});

module.exports = router;
