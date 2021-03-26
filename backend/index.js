"use strict";
const app = require("./app");

//routes
const login = require("./routes/login");
const signup = require("./routes/signup");

app.use("/login", login);
app.use("/signup", signup);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;