const Users = require("../models/UserModel");
var express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const { auth } = require("../passport");
var kafka = require("../kafka/client");
auth();

router.post("/", (req, res) => {
  kafka.make_request(
      "login",
      {
        email: req.body.email,
        password: req.body.password
      },
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.message === "login success") {
            const payload = {
              _id: result._id,
              email: result.email,
              name: result.name,
              currency: result.currency,
            };
            const token = jwt.sign(payload, secret, {
              expiresIn: 1008000
            });
            res.cookie("cookie", result.email, {
              maxAge: 900000,
              httpOnly: false,
              path: "/",
            });
            // req.session.user = user;
            res.send({ message: result.message, token: "JWT " + token });

          }
          else {
            res.send({ message: result.message });
          }
        }

});
});

module.exports = router;
