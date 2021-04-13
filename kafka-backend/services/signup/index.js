const Users = require("../../models/UserModel");
const passwordHash = require("password-hash");
const { auth } = require("../../passport");
auth();

function handle_request(message, callback) {
    var res = {};
    console.log("In signup handle request:" + JSON.stringify(message));
    var newuser = new Users({
    name: message.name,
    email: message.email,
    password: passwordHash.generate(message.password),
    timezone: "(GMT-08:00) Pacific Time (US & Canada)",
    language: "English",
    currency: "$",
    phone: "",
  });

  Users.findOne({ email: message.email }, (error, user) => {
    if (error) {
      res.end();
    }
    if (user) {
      res.message = "Account with email id already exists.";
      callback(null, res);
    } else {
      newuser.save((error, data) => {
        if (error) {
          res.message = error
          callback(error, null);
        } else {
        res._id = data._id;
        res.message  = "sign up success";
        callback(null, res);
        }
      });
    }
  });
}

exports.handle_request = handle_request;

