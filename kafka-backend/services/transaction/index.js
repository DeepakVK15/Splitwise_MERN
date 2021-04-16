"use strict";
const { lender } = require("./transaction");
const { borrower } = require("./transaction");
const { settleUp } = require("./transaction");
const { modal } = require("./transaction");

function handle_request(message, callback) {
  switch (message.route) {
    case "lender":
      lender(message, callback);
      break;

    case "borrower":
      borrower(message, callback);
      break;

    case "settleUp":
      settleUp(message, callback);
      break;

    case "modal":
      modal(message, callback);
      break;
  }
}

exports.handle_request = handle_request;
