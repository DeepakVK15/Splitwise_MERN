var express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/lender", (req, res) => {
  let msg = {};
  msg.route = "lender";
  msg.email = req.query.email;
  kafka.make_request("transaction", msg, function (err, result) {
    if (result) {
      res.send(result);
    }
  });
});

router.get("/borrower", (req, res) => {
  let msg = {};
  msg.route = "borrower";
  msg.email = req.query.email;
  kafka.make_request("transaction", msg, function (err, result) {
    if (result) {
      res.send(result);
    }
  });
});

router.post("/settleup", (req, res) => {
  let msg = {};
  msg.route = "settleUp";
  msg.name = req.body.name;
  msg.groupname = req.body.groupname;
  kafka.make_request("transaction", msg, function (err, result) {
    if (result) {
      res.send(result);
    }
  });
});

router.post("/modal", (req, res) => {
  let msg = {};
  msg.route = "modal";
  msg.modalEmail = req.body.modalEmail;
  msg.email = req.body.email;
  kafka.make_request("transaction", msg, function (err, result) {
    if (result) {
      console.log("settled ", result);
    }
  });
});

module.exports = router;
