var express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", (req, res) => {
  let msg = {};
  msg.route = "getUserProfile";
  msg.email = req.query.email;
  kafka.make_request("profile", msg, function (err, result) {
    if (result) {
      res.send(result);
    }
  });
});

router.post("/", (req, res) => {
  let msg = {};
  msg.route = "updateProfile";
  msg.email = req.body.email;
  msg.name = req.body.name;
  msg.phone = req.body.phone;
  msg.timezone = req.body.timezone;
  msg.currency = req.body.currency;
  msg.language = req.body.language;
  kafka.make_request("profile", msg, function (err, result) {
    if (result) {
      res.send(result);
    }
  });
});

module.exports = router;
