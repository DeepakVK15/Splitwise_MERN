"use strict";
const { createGroup } = require("./createGroup");
const { addExpense } = require("./expense");
const {getExpenses} = require("./expense");
const {addNote} = require("./note");
const {getNotes} = require("./note");
const {deleteNote} = require("./note");
const {getBalance} = require("./expense");
const { groupMembers } = require("./createGroup");

function handle_request(message, callback) {
    switch (message.route) {
        case "createGroup":
            createGroup(message, callback);
            break;
        case "addExpense":
            addExpense(message, callback);
            break;
        case "getExpenses":
            getExpenses(message,callback);
            break;
        case "addNote":
            addNote(message, callback);
            break;
        case "getNotes":
            getNotes(message, callback);
            break;
        case "deleteNote":
            deleteNote(message, callback);
            break;
        case "getBalance":
            getBalance(message, callback);
            break;
        case "groupMembers":
            groupMembers(message, callback);
            break;
    }
}

exports.handle_request = handle_request;