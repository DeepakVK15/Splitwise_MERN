const Users = require("../../models/UserModel");
const passwordHash = require("password-hash");

function handle_request(message, callback) {
  var res = {};
  console.log("In login handle request:" + JSON.stringify(message));
  const password = message.password;
  Users.findOne({ email: message.email }, (error, user) => {
    if (error) {
      callback(error, null);
    }
    if (user && passwordHash.verify(password, user.password)) {
        res._id = user._id;
        res.currency = user.currency;
        res.name = user.name;
        res.email = user.email;
        res.message = "login success";
        callback(null, res);
    }
    else{
        res.message = "Incorrect username or password.";
        callback(null, res);
    }
  });
}

exports.handle_request = handle_request;

