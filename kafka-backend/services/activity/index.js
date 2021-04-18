const Activity = require("../../models/RecentActivityModel");
const GroupUsers = require("../../models/GroupUsersModel");

function handle_request(message, callback) {
  let resultList = [];
  let count = 0;
  GroupUsers.find({ email: message.email }, (error, groups) => {
    console.log("Group list ", groups);
    groups.forEach((group) => {
      Activity.find({ groupname: group.groupname })
        .populate("user")
        .then((activities, error) => {
          if (error) console.log("Activity error ", error);
          if (activities) {
            count = count + 1;
            resultList = resultList.concat(activities);
            if (groups.length === count) {
              console.log("Activities ", activities);
              callback(null, resultList);
            }
          }
        });
    });
  });
}

exports.handle_request = handle_request;
