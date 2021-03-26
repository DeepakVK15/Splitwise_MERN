const Users = require("../models/UserModel");
var express = require("express");
const router = express.Router();
const passwordHash = require("password-hash");
const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const { auth } = require("../passport");
auth();

router.post("/", (req, res) => {
  const password = req.body.password;
  console.log("Password", password);
  Users.findOne(
    { email: req.body.email},
    (error, user) => {
      if (error) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end("Error Occured");
      }
      if (passwordHash.verify(password, user.password)) {
        const payload = { _id: user._id, email: user.email};
        const token = jwt.sign(payload, secret, {
            expiresIn: 1008000
        });
        res.cookie("cookie", user.email, {
          maxAge: 900000,
          httpOnly: false,
          path: "/",
        });
        req.session.user = user;
        res.send({ message: "login success", token:"JWT "+token });
      } else {
        res.send({ message: "Incorrect username or password." });
      }
    }
  );
});

module.exports = router;
