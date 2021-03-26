const Users = require("../models/UserModel");
var express = require("express");
const router = express.Router();
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const { auth } = require("../passport");
auth();

router.post("/", (req, res) => {
  var newuser = new Users({
    name: req.body.name,
    email: req.body.email,
    password: passwordHash.generate(req.body.password),
    timezone: "(GMT-08:00) Pacific Time (US & Canada)",
    language: "English",
    currency: "$",
    phone: "",
  });

  Users.findOne({ email: req.body.email }, (error, user) => {
    if (error) {
      res.end();
      console.log("error1");
    }
    if (user) {
      res.send({ message: "Account with email id already exists." });
    } else {
      newuser.save((error, data) => {
        if (error) {
          res.end();
          console.log(error);
        } else {
            res.cookie("cookie", newuser.email, {
                maxAge: 900000,
                httpOnly: false,
                path: "/",
              });
              req.session.user = user;
          const payload = { _id: data._id, email: newuser.email };
          const token = jwt.sign(payload, secret, {
            expiresIn: 1008000,
          });
          res.send({ message: "sign up success", token: "JWT " + token });
        }
      });
    }
  });
});

module.exports = router;
