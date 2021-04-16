var express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const { auth } = require("../passport");
var kafka = require("../kafka/client");
auth();

router.post("/", (req, res) => {
  kafka.make_request(
    "signup",
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      timezone: "(GMT-08:00) Pacific Time (US & Canada)",
      language: "English",
      currency: "$",
      phone: "",
    },
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Logging result ", result);
        if (result.message === "sign up success") {
          const payload = {
            _id: result._id,
            email: req.body.email,
            name: req.body.name,
            currency: "$",
          };
          const token = jwt.sign(payload, secret, {
            expiresIn: 1008000,
          });
          res.cookie("cookie", req.body.email, {
            maxAge: 900000,
            httpOnly: false,
            path: "/",
          });
          // req.session.user = user;
         
          res.send({ message: result.message, token: "JWT " + token });
        } else {
          res.send({ message: result.message });
        }
      }
    }
  );
});

module.exports = router;
