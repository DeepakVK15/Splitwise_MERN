const Groups = require("../models/GroupModel");
const Invite = require("../models/InviteModel");
const Users = require("../models/UserModel");
const GroupUsers = require("../models/GroupUsersModel");
const Expense = require("../models/ExpenseModel");
const Transaction = require("../models/TransactionModel");
const Activity = require("../models/RecentActivityModel");
const Note = require("../models/NoteModel.js");

var express = require("express");
const router = express.Router();

router.post("/createGroup", (req, res) => {
  const members = req.body.members;
  const createdBy = req.body.createdBy;
  const createdBy_name = req.body.createdBy_name;
  const newgroup = new Groups({
    name: req.body.groupname,
    image: null,
  });
  const usergroup = new GroupUsers({
    email: createdBy,
    groupname: req.body.groupname,
  });

  Groups.findOne({ name: req.body.groupname }, (error, group) => {
    if (error) {
      console.log("IS ", error);
    }
    if (group) {
      res.send({ message: "Group with the same name already exists." });
    } else {
      newgroup.save();
      usergroup.save();
      members.forEach((element) => {
        const data = new Invite({
          invite_by: createdBy_name,
          invite_to: element.email,
          groupname: req.body.groupname,
        });
        data.save((error, data) => {
          if (error) {
            console.log(error);
          }
        });
      });
    }
  });

  Users.findOne({ email: createdBy }, (err, usr) => {
    const activity = new Activity({
      user: usr._id,
      operation: "created",
      groupname: req.body.groupname,
    });
    activity.save((error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    });
  });

  res.send({ message: "inserted users" });
});

router.get("/members", (req, res) => {
  GroupUsers.find({ groupname: req.query.name }, (error, members) => {
    if (error) console.log(error);
    else {
      res.send(members);
    }
  });
});

router.post("/addExpense", (req, res) => {
  const paid_by = req.body.paid_by;
  const amount = req.body.amount;
  const members = req.body.members;
  Users.findOne({ email: paid_by }, (err, user) => {
    if (user) {
      const expense = new Expense({
        description: req.body.description,
        paid_by: user._id,
        group_name: req.body.groupname,
        amount: req.body.amount,
        date: req.body.date,
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
                groupid: req.body.groupname,
                amount: individualContribution,
                date: req.body.date,
              });
              transaction.save();
            }
          });
        }
      }
      const activity = new Activity({
        user: user._id,
        operation: "added",
        groupname: req.body.groupname,
        amount: amount,
        description: req.body.description,
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
          console.log(data);
        }
      });
    }
  });
});

router.get("/expenses", (req, res) => {
  Expense.find({ group_name: req.query.name })
    .populate("paid_by")
    .then((expenses) => {
      if (expenses) {
        // console.log("expenses ",expenses);
        res.send(expenses);
      }
    });
});

router.get("/users", (req, res) => {
  Users.find((error, users) => {
    if (error) console.log(error);
    if (users) {
      console.log("Users ", users);
      res.send(users);
    }
  });
});

router.get("/lended", (req, res) => {
  let members = req.query.members;
  let bal = 0;
  let togive = 0;
  let r = [];
  let obj;
  for (let i = 0; i < members.length; i++) {
    members[i] = JSON.parse(members[i]);
    Users.findOne({ email: members[i].email }, (err, member) => {
      Transaction.find(
        { groupid: req.query.groupname, lenderid: member._id },
        (error, transactions) => {
          if (error) {
            console.log("Error", error);
          }
          if (transactions) {
            // console.log("Transactions for ",member.email," ",transactions);
            transactions.forEach((transaction) => {
              bal = bal + transaction.amount;
            });
            obj = {
              email: member.name,
              balance: bal,
            };
            r.push(obj);
            console.log("Balance for ", member.email, " ", bal);
            bal = 0;
          }
        }
      );
    });
  }
  for (let j = 0; j < members.length; j++) {
    Users.findOne({ email: members[j].email }, (err, member) => {
      Transaction.find(
        { groupid: req.query.groupname, borrowerid: member._id },
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
              console.log("Res", r);
              res.send(r);
            }
          }
        }
      );
    });
  }
});

// Transaction.find(
//   { groupid: req.query.groupname, borrowerid: member._id },
//   (error, transacts) => {
//     if (error) {
//       console.log(error);
//     }
//     if (transacts) {
//       transacts.forEach((transact) => {
//         togive = togive + transact.amount;
//       });
//       bal = bal - togive;
//       obj = {
//         email: member.name,
//         balance: bal,
//       };
//       bal=0;
//       togive = 0;
//        r.push(obj);
//        if (i == members.length - 1) {
//          res.send(r);
//        }
//     }});

router.get("/borrowed", (req, res) => {
  let members = req.query.members;
  let bal = 0;
  let r = [];
  let obj;
  for (let i = 0; i < members.length; i++) {
    members[i] = JSON.parse(members[i]);
    Users.findOne({ email: members[i].email }, (err, member) => {
      Transaction.find(
        { groupid: req.query.groupname, borrowerid: member._id },
        (error, transactions) => {
          if (error) {
            console.log(error);
          }
          if (transactions) {
            transactions.forEach((transaction) => {
              bal = bal + transaction.amount;
            });
          }
          obj = {
            email: member.name,
            balance: bal,
          };
          r.push(obj);
          if (i == members.length - 1) {
            // console.log("Borrowed ",r);
            res.send(r);
          }
          bal = 0;
        }
      );
    });
  }
});

// router.get("/lended", (req, res) => {
//   console.log("Lended here");
// const members = req.query.members;
//   for(let i=0;i<members.length;i++){
//   Users.findOne({email:members[i].email}, (usr,err) => {
//     console.log("User  ",err);
//     if(usr){
//       Transaction.find({lenderid: usr._id, groupid:req.query.groupname }).populate('lenderif').then((transactions, error) => {
//         if (error) {
//           console.log("Error", error);
//         } else {
//           console.log("transactions ",transactions);
//           res.send(transactions);
//         }
//       });
//     }
//   })
// }
//   });

router.post("/note", (req, res) => {
  const note = new Note({
    expense: req.body.expense,
    user: req.body.user,
    note: req.body.comment,
  });
  note.save();
  
    Expense.findOne({_id:req.body.expense}, (err,expense) => {
      if(expense){
        console.log("Expense: ", expense);
        const activity = new Activity({
          user:req.body.user,
          operation:"note",
          groupname:expense.groupname,
          description:req.body.comment
        });
        activity.save((error, data) => {
          if (error) {
            console.log("Erroring", error);
          } else {
            console.log("data ",data);
          }
        });      }
    })
});

router.get("/note", (req, res) => {
  console.log("Noting...");
  console.log("Expense ", req.query.expense);
  Note.find({ expense: req.query.expense })
    .populate("user")
    .then((notes, err) => {
      if (err) {
        console.log("Err ", err);
      }
      if (notes) {
        console.log("Notes ", notes);
        res.send(notes);
      }
    });
});


router.post("/deleteNote", (req, res) => {
  console.log("Deleting Note");
  Note.deleteOne({ _id: req.body.note }, (err, note) => {
    if (err) console.log(err);
  });
  console.log("Deleted");
});

module.exports = router;
