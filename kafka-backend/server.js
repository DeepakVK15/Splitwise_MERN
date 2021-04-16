var connection = new require("./kafka/connections");
var mongoose = require("mongoose");
const { mongoDB } = require("./config");

var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 500,
  bufferMaxEntries: 0,
};

mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log(`MongoDB Connection Failed`);
  } else {
    console.log(`MongoDB Connected......`);
  }
});

const signup = require("./services/signup");
const login = require("./services/login");
const group = require("./services/group");
const activity = require("./services/activity");
const mygroups = require("./services/mygroups");
const transaction = require("./services/transaction");
const profile = require("./services/profile");

//Handle topic request
const handleTopicRequest = (topic_name, fname) => {
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  // console.log("Kafka Server is running ");
  consumer.on("message", function (message) {
    console.log("Message received for " + topic_name);
    var data = JSON.parse(message.value);
    fname.handle_request(data.data, (err, res) => {
      response(data, res, err, producer);
      return;
    });
  });
};

const response = (data, res, err, producer) => {
  var payloads = [
    {
      topic: data.replyTo,
      messages: JSON.stringify({
        correlationId: data.correlationId,
        data: res,
        err: err,
      }),
      partition: 0,
    },
  ];
  producer.send(payloads, function (err, data) {
    if (err) {
      console.log("Error when producer sending data", err);
    } else {
      console.log(data);
    }
  });
  return;
};

handleTopicRequest("signup", signup);
handleTopicRequest("login", login);
handleTopicRequest("group", group);
handleTopicRequest("activity", activity);
handleTopicRequest("mygroups", mygroups);
handleTopicRequest("transaction", transaction);
handleTopicRequest("profile", profile);
