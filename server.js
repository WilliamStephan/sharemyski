// Require dotenv for environment variables
require("dotenv").config();

//requires for app
let fs = require('fs');
let path = require('path');

let express = require("express");
let exphbs = require("express-handlebars");
let session = require("express-session")
let bodyParser = require("body-parser");

let passport = require('passport');
let passportfb = require('passport-facebook');
let passportloc = require('passport-local');

let db = require("./models");
let app = express();
let PORT = process.env.PORT || 3000;

// Middleware for Facebook Auth
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app, passport);
require("./routes/htmlRoutes")(app, passport);

let syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;