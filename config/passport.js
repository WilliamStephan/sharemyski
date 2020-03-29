var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var db = require("../models");

let facebookAuth = {
  'clientID': process.env.FACEBOOK_CLIENT_ID, // your App ID
  'clientSecret': process.env.FACEBOOK_CLIENT_SECRET, // your App Secret
  'callbackURL': '/auth/facebook/callback',
  'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
  'profileFields': ['id', 'email', 'name'],
  'proxy': true // For requesting permissions from Facebook API
};


// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(new LocalStrategy(
  // Our user will sign in using an email, rather than a "username"
  {
    usernameField: "email"
  },
  function (email, password, done) {
    // When a user tries to sign in this code runs
    db.User.findOne({
      where: {
        email: email
      }
    }).then(function (dbUser) {
      // If there's no user with the given email
      if (!dbUser) {
        return done(null, false, {
          message: "Incorrect email."
        });
      }
      // If there is a user with the given email, but the password the user gives us is incorrect
      else if (!dbUser.validPassword(password)) {
        return done(null, false, {
          message: "Incorrect password."
        });
      }
      // If none of the above, return the user
      return done(null, dbUser);
    });
  }
));

passport.use(new FacebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID: facebookAuth.clientID,
    clientSecret: facebookAuth.clientSecret,
    callbackURL: facebookAuth.callbackURL,
    profileFields: facebookAuth.profileFields,
    proxy: true
  },

  // facebook will send back the token and profile
  function (token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function () {

      console.log(token);
      console.log(profile);
      db.User.findOne({
        where: [{
          [db.Sequelize.Op.or]: [{fb_id: profile.id}, {email: profile.emails[0].value}]
        }]
      }).then(function (dbUser) {
        if (dbUser) {
          return done(null, dbUser); // user found, return that user
        } else {
          // if there is no user found with that facebook id, create them
          var newUser = {
            name: profile.name.familyName + " " + profile.name.givenName,
            fb_id: profile.id,
            email: profile.emails[0].value,
            token: token,
            password: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
          };

          db.User.create(newUser).then(function (dbUser) {
            return done(null, dbUser);
          });
        }
      });
    });

  }));


// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;