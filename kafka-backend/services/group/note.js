const Note = require("../../models/NoteModel.js");
const Expense = require("../../models/ExpenseModel");
const Activity = require("../../models/RecentActivityModel");

let addNote = async (msg, callback) => {
  const note = new Note({
    expense: msg.expense,
    user: msg.user,
    note: msg.comment,
  });
  note.save();

  Expense.findOne({ _id: msg.expense }, (err, expense) => {
    if (expense) {
      console.log("Expense: ", expense);
      const activity = new Activity({
        user: msg.user,
        operation: "note",
        groupname: expense.group_name,
        description: msg.comment,
      });
      activity.save((error, data) => {
        if (error) {
          console.log("Erroring", error);
        } else {
          console.log("Data", data);
        }
      });
    }
  });
};

let getNotes = async (msg, callback) => {
  Note.find({ expense: msg.expense })
    .populate("user")
    .then((notes, err) => {
      if (err) {
        console.log("Err ", err);
      }
      if (notes) {
        console.log("Notes ", notes);
        callback(null, notes);
      }
    });
};

let deleteNote = async (msg, callback) => {
  Note.deleteOne({ _id: msg.note }, (err, note) => {
    if (note) callback(null,note);
  });
}

exports.addNote = addNote;
exports.getNotes = getNotes;
exports.deleteNote = deleteNote;

