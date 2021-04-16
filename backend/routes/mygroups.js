var express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", (req, res) => {
  let msg = {};
  msg.route = "groups";
  msg.email = req.query.email;
  kafka.make_request("mygroups", msg, function (err, result) {
    if (result) {
      res.send(result);
    }
  });
});

router.get("/invites", (req, res) => {
  let msg = {};
  msg.route = "invites";
  msg.invite_to = req.query.invite_to;
  kafka.make_request("mygroups", msg, function (err, result) {
    if (result) {
      res.send(result);
    }
  });
});

router.post("/acceptInvite", (req, res) => {
  let msg = {};
  msg.route = "acceptInvite";
  msg.group = req.body.group;
  msg.invite_to = req.body.invite_to;
  kafka.make_request("mygroups", msg, function (err, result) {
    if (result) {
      console.log("Accept invite ", result);
      res.send(result);
    }
  });
});

router.post("/rejectInvite", (req, res) => {
  let msg = {};
  msg.route = "rejectInvite";
  msg.group = req.body.group;
  msg.invite_to = req.body.invite_to;
  kafka.make_request("mygroups", msg, function (err, result) {
    if (result) {
      console.log("Accept invite ", result);
      res.send(result);
    }
  });
});

module.exports = router;
