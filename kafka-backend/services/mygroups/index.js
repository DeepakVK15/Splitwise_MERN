"use strict";
const { groups } = require("./groups");
const { acceptInvite } = require("./invite.js");
const { rejectInvite } = require("./invite.js");
const { invites } = require("./invite.js");

function handle_request(message, callback) {
  switch (message.route) {
    case "groups":
      groups(message, callback);
      break;
    case "acceptInvite":
        acceptInvite(message, callback);
        break;
    case "rejectInvite":
        rejectInvite(message, callback);
        break;
    case "invites":
        invites(message, callback);
        break;
  }
}

exports.handle_request = handle_request;
