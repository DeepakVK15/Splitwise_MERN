var express = require("express");
const router = express.Router();
const Activity = require("../models/RecentActivityModel");
const GroupUsers = require("../models/GroupUsersModel");

router.get("/",(req, res) => {
    let resultList = [];
    let count = 0;;
    GroupUsers.find({email:req.query.email},(error, groups) => {
        console.log("Group list ",groups);
        groups.forEach((group) => { 
        Activity.find({groupname:group.groupname}).populate('user').then((activities,error) => {
            if(error) console.log("Activity error ", error); 
            if(activities){
                count = count+1;
                    resultList = resultList.concat(activities);
                    if(groups.length === count){
                        console.log("Activities ", activities);

                        res.send(resultList);
                    }
                }
                
        })})
     } )
    
    })

module.exports = router;
