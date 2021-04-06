var express = require("express");
const router = express.Router();
const Transaction = require("../models/TransactionModel");
const Users = require("../models/UserModel");
const Activity = require("../models/RecentActivityModel");


// router.get("/lender", (req, res) => {
//   Transaction.find({ lenderid: req.query.email }, (error, transactions) => {
//     if (error) {
//       console.log("Error", error);
//     } else {
//       for (let i = 0; i < transactions.length; i++) {
//         Users.findOne({ email: transactions[i].borrowerid }, (err, user) => {
//           if (user) transactions[i].borrowerid = user.name;
//         });
//       }
//       res.send(transactions);
//     }
//   });
// });


router.get("/lender", (req, res) => {
Users.findOne({email:req.query.email}, (err,usr) => {
  if(usr){
    Transaction.find({lenderid: usr._id }).populate('borrowerid').then((transactions, error) => {
      if (error) {
        console.log("Error", error);
      } else {
        res.send(transactions);
      }
    });
  }
});
  
});

router.get("/borrower", (req, res) => {
  Users.findOne({email:req.query.email}, (err,usr) => {
    if(usr){
      Transaction.find({borrowerid: usr._id }).populate('lenderid').then((transactions, error) => {
        if (error) {
          console.log("Error", error);
        } else {
          // console.log("Transactions2 ",transactions);
          // for (let i = 0; i < transactions.length; i++) {
          //   Users.findOne({ email: transactions[i].borrowerid }, (err, user) => {
          //     if (user) transactions[i].borrowerid = user.name;
          //   });
          // }
          // console.log("transactions2 ",transactions);
          res.send(transactions);
        }
      });
    }
  });
  });

// router.get("/borrower", (req, res) => {
//   Transaction.find({ borrowerid: req.query.email }, (error, transactions) => {
//     if (error) {
//       console.log("Error", error);
//     } else {
//       for (let i = 0; i < transactions.length; i++) {
//         Users.findOne({ email: transactions[i].lenderid }, (err, user) => {
//           if (user) transactions[i].lenderid = user.name;
//         });
//       }
//       res.send(transactions);
//     }
//   });
// });

router.post("/settleup", (req, res) => {
    let userid;

  Users.findOne({email:req.body.name}, (err, usr)=>{
    if(err){
      console.log("Errrrrrr ",err);
    }
    if(usr){
      userid = usr._id;
      Transaction.deleteMany(
        { borrowerid: usr._id },
        { groupid: req.body.groupname },
        (error, transaction) => {
          if (error) console.log("Here ",error);
          else {
            console.log("User id2 ",userid);
            res.send("Balance settled");
          }
        }
      );
      const activity = new Activity({
        user : userid,
        operation: "settled up",
        groupname: req.body.groupname,
      })
      activity.save((error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log(data);
        }
      });
    }
  })    
  });
router.post("/modal", (req, res) => {
    Users.findOne({email:req.body.modalEmail}, (err, user) => {
        if(user){
          Transaction.deleteMany(
            { borrowerid: req.body.email },
            { lenderid: req.body.modalEmail },
            (error, transaction) => {
              if (error) console.log(error);
              else {
                console.log("coming", transaction);
              }
            }
          );
        }
    })

  
});

module.exports = router;
