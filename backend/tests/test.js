const app = require("../index");
const chai = require("chai");
chai.use(require("chai-http"));
const expect = require("chai").expect;
const agent = require("chai").request.agent(app);

describe("SplitWise", function () {
  describe("Login", function () {
    it("Successful Login", () => {
      agent
        .post("/login/")
        .send({ email: "deepak@test.com", password: "deepak123" })
        .then(function (res) {
          expect(res.body.message).to.equal("login success");
        })
        .catch((error) => {
          console.log(error);
        });
    });

    it("Invalid Credentials", () => {
      agent
        .post("/login/")
        .send({ email: "deepak@test.com", password: "deepak" })
        .then(function (res) {
          expect(res.text).to.equal(
            '{"message":"Incorrect username or password."}'
          );
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
});

describe("Signup", function () {
  it("Successful Signup", () => {
    agent
      .post("/signup/")
      .send({ name: "test", email: "mocha@test.com", password: "test1234" })
      .then(function (res) {
        expect(res.body.message).to.equal("sign up success");
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it("Account Already Exists", () => {
    agent
      .post("/signup/")
      .send({ name: "test", email: "deepak@test.com", password: "test1234" })
      .then(function (res) {
        expect(res.text).to.equal(
          '{"message":"Account with email id already exists."}'
        );
      })
      .catch((error) => {
        console.log(error);
      });
  });

  describe("Send Invite", function () {
    it("Send invite to add a user to group", () => {
      agent
        .post("/group/addUserToGroup")
        .send({
          email: "split@wise.com",
          groupname: "TestSaturday",
          invitedby: "deepak@test.com",
        })
        .then(function (res) {
          expect(res.text).to.equal("Invite sent to user.");
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  describe("User Profile", function () {
    it("Update user profile", () => {
      agent
        .put("/profile/")
        .send({
          name: "Deepak",
          email: "deepak@test.com",
          phone: "1234567",
          language: "English",
          currency: "$",
          timezone: "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
        })
        .then(function (res) {
          expect(res.text).to.equal("Profile updated successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  describe("Settle balance", function () {
    it("User settles the balance amount in a group", () => {
      agent
        .post("/transactions/settleUp")
        .send({ name: "john@test.com", groupname: "TestSaturday" })
        .then(function (res) {
          expect(res.text).to.equal("Balance settled");
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
});
