const Transaction = require("../../models/TransactionModel");
const Users = require("../../models/UserModel");
const Activity = require("../../models/RecentActivityModel");

let lender = async (msg, callback) => {
  Users.findOne({ email: msg.email }, (err, usr) => {
    if (usr) {
      Transaction.find({ lenderid: usr._id })
        .populate("borrowerid")
        .then((transactions, error) => {
          if (error) {
            console.log("Error", error);
          } else {
            callback(null, transactions);
          }
        });
    }
  });
};

let borrower = async (msg, callback) => {
  Users.findOne({ email: msg.email }, (err, usr) => {
    if (usr) {
      Transaction.find({ borrowerid: usr._id })
        .populate("lenderid")
        .then((transactions, error) => {
          if (error) {
            console.log("Error", error);
          } else {
            callback(null, transactions);
          }
        });
    }
  });
};

let settleUp = async (msg, callback) => {
  let userid;

  Users.findOne({ email: msg.name }, (err, usr) => {
    if (err) {
      console.log("Errrrrrr ", err);
    }
    if (usr) {
      userid = usr._id;
      Transaction.deleteMany(
        { borrowerid: usr._id },
        { groupid: msg.groupname },
        (error, transaction) => {
          if (error) console.log("Here ", error);
          else {
            console.log("User id2 ", userid);
            callback(null, "Balance settled");
          }
        }
      );
      const activity = new Activity({
        user: userid,
        operation: "settled up",
        groupname: msg.groupname,
      });
      activity.save((error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log(data);
        }
      });
    }
  });
};

let modal = async (msg, callback) => {
  Users.findOne({ email: msg.modalEmail }, (err, user) => {
    if (user) {
      Transaction.deleteMany(
        { borrowerid: msg.email },
        { lenderid: msg.modalEmail },
        (error, transaction) => {
          if (error) console.log(error);
          else {
            console.log("settled", transaction);
          }
        }
      );
    }
  });
};

exports.lender = lender;
exports.borrower = borrower;
exports.settleUp = settleUp;
exports.modal = modal;
