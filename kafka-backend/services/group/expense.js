const Expense = require("../../models/ExpenseModel");
const Transaction = require("../../models/TransactionModel");
const Activity = require("../../models/RecentActivityModel");
const Users = require("../../models/UserModel");

let addExpense = async (msg, callback) => {
  const paid_by = msg.paid_by;
  const amount = msg.amount;
  const members = msg.members;
  var res = {};
  Users.findOne({ email: paid_by }, (err, user) => {
    if (user) {
      const expense = new Expense({
        description: msg.description,
        paid_by: user._id,
        group_name: msg.groupname,
        amount: msg.amount,
        date: msg.date,
      });
      const individualContribution = (amount / members.length).toFixed(3);
      console.log("Members length ", members.length);
      for (let i = 0; i < members.length; i++) {
        console.log("userid ", user._id);
        console.log("paid_by ", paid_by);
        console.log("members email ", members[i].email);
        if (paid_by !== members[i].email) {
          Users.findOne({ email: members[i].email }, (err, brwr) => {
            if (brwr) {
              console.log("Brwrid", brwr._id);
              const transaction = new Transaction({
                lenderid: user._id,
                borrowerid: brwr._id,
                groupid: msg.groupname,
                amount: individualContribution,
                date: msg.date,
              });
              transaction.save();
            }
          });
        }
      }
      const activity = new Activity({
        user: user._id,
        operation: "added",
        groupname: msg.groupname,
        amount: amount,
        description: msg.description,
      });
      expense.save((error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log(data);
        }
      });

      activity.save((error, data) => {
        if (error) {
          console.log(error);
        } else {
          res.message = "Success";
          return callback(null, res);
        }
      });
    }
  });
};

let getExpenses = async (msg, callback) => {
  Expense.find({ group_name: msg.name })
    .populate("paid_by")
    .then((expenses) => {
      if (expenses) {
        callback(null, expenses);
      }
    });
};

let getBalance = async (msg, callback) => {
  let members = msg.members;
  let bal = 0;
  let togive = 0;
  let r = [];
  let obj;
  for (let i = 0; i < members.length; i++) {
    members[i] = JSON.parse(members[i]);
    Users.findOne({ email: members[i].email }, (err, member) => {
      Transaction.find(
        { groupid: msg.groupname, lenderid: member._id },
        (err, transactions) => {
          if (err) {
            console.log(err);
          }
          if (transactions) {
            transactions.forEach((transaction) => {
              bal = bal + transaction.amount;
            });
            obj = {
              email: member.name,
              balance: bal,
            };
            r.push(obj);
            console.log("Balance for ", member.email, "  ", bal);
            bal = 0;
          }
        }
      );
    });
  }

  for (let j = 0; j < members.length; j++) {
    Users.findOne({ email: members[j].email }, (err, member) => {
      Transaction.find(
        { groupid: msg.groupname, borrowerid: member._id },
        (error, transacts) => {
          if (error) {
            console.log(error);
          }
          if (transacts) {
            transacts.forEach((transact) => {
              togive = togive + transact.amount;
            });
            r.forEach((obj) => {
              if (obj.email === member.name) {
                obj.balance = obj.balance - togive;
              }
            });
            togive = 0;
            if (j === members.length - 1) {
              callback(null, r);
            }
          }
        }
      );
    });
  }
};

exports.addExpense = addExpense;
exports.getExpenses = getExpenses;
exports.getBalance = getBalance;
