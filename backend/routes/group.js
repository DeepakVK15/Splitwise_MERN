const Users = require("../models/UserModel");
const GroupUsers = require("../models/GroupUsersModel");
const Invite = require("../models/InviteModel");
var kafka = require("../kafka/client");

var express = require("express");
const router = express.Router();

router.post("/createGroup", (req, res) => {
  let msg = {};
  msg.route = "createGroup";
  msg.members = req.body.members;
  msg.createdBy = req.body.createdBy;
  msg.createdBy_name = req.body.createdBy_name;
  msg.groupname = req.body.groupname;
  kafka.make_request("group", msg, function (err, result) {
    if (result) {
      res.send({ message: result.message });
    }
  });
});

router.get("/members", (req, res) => {
  let msg = {};
  msg.name = req.query.name;
  msg.route = "groupMembers";
  kafka.make_request("group", msg, function (err, result) {
    if (result) {
      res.send(result);
    }
  });
});

router.post("/addExpense", (req, res) => {
  let msg = {};
  msg.route = "addExpense";
  msg.members = req.body.members;
  msg.createdBy = req.body.createdBy;
  msg.createdBy_name = req.body.createdBy_name;
  msg.groupname = req.body.groupname;
  msg.date = req.body.date;
  msg.paid_by = req.body.paid_by;
  msg.amount = req.body.amount;
  msg.description = req.body.description;
  kafka.make_request("group", msg, function (err, result) {
    if (result) res.send("Expense Added");
  });
});

router.get("/expenses", (req, res) => {
  let msg = {};
  msg.name = req.query.name;
  msg.route = "getExpenses";
  kafka.make_request("group", msg, function (err, result) {
    if (result) {
      console.log("result ", result);
      res.send(result);
    }
  });
});

router.get("/users", (req, res) => {
  Users.find((error, users) => {
    if (error) console.log(error);
    if (users) {
      console.log("Users ", users);
      res.send(users);
    }
  });
});

router.get("/balance", (req, res) => {
  let msg = {};
  msg.members = req.query.members;
  msg.groupname = req.query.groupname;
  msg.route = "getBalance";
  kafka.make_request("group", msg, function (err, result) {
    if (result) {
      console.log("result ", result);
      res.send(result);
    }
  });
});

router.post("/leaveGroup", (req, res) => {
  let members = [];
  let user = {
    email: req.body.name,
    _id: req.body.id,
  };
  user = JSON.stringify(user);
  members.push(user);
  let msg = {};
  msg.members = members;
  msg.groupname = req.body.groupname;
  msg.route = "getBalance";
  kafka.make_request("group", msg, function (err, result) {
    if (result && result[0].balance) {
      if (result[0].balance > 0) {
        res.send(
          "Please clear your dues and leave the group after recieving the amount you are owed."
        );
      } else if (result[0].balance < 0) {
        res.send("Please clear your dues to leave the group.");
      } else {
        GroupUsers.deleteOne(
          { email: req.body.name, groupname: req.body.groupname },
          (error, result2) => {
            if (error) console.log(error);
            else res.send("Exited from group");
          }
        );
      }
    }
  });
});

router.post("/note", (req, res) => {
  let msg = {};
  msg.route = "addNote";
  (msg.expense = req.body.expense),
    (msg.user = req.body.user),
    (msg.comment = req.body.comment),
    kafka.make_request("group", msg, function (err, result) {
      if (result) {
        console.log("result ", result);
        res.send(result);
      }
    });
});

router.get("/note", (req, res) => {
  let msg = {};
  msg.route = "getNotes";
  msg.expense = req.query.expense;
  kafka.make_request("group", msg, function (err, result) {
    if (result) {
      console.log("Notes ", result);
      res.send(result);
    }
  });
});

router.post("/deleteNote", (req, res) => {
  let msg = {};
  msg.route = "deleteNote";
  msg.note = req.body.note;
  kafka.make_request("group", msg, function (err, result) {
    if (result) console.log("Result ", result);
  });
});

router.post("/addUserToGroup", function (req, res) {
 
  let invite = new Invite({
    invite_by:req.body.invitedby,
    invite_to:req.body.email,
    groupname:req.body.groupname
  });
  invite.save();
    res.send("Invite sent to user.");
});

module.exports = router;
