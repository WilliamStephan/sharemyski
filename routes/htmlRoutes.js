let db = require("../models");
let path = require("path");

// Requiring our custom middleware for checking if a user is logged in
let isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app, passport) {
  // Load index page
  app.get("/", function (req, res) {
    if (req.user) {
      console.log(req.user);
      res.render("index", {
        title: "sharemyski - the best place to find gear",
        loggedIn: true,
        user: req.user
      });
    } else {
      res.render("index", {
        title: "sharemyski - the best place to find gear",
        loggedIn: false
      });
    }
  });

  // Load search page
  app.post("/search", function (req, res) {
    db.Item.findAll({
      include: [{
        model: db.User
      }]
    }).then(function (dbItem) {
      console.log(dbItem);
      if (req.user) {
        console.log(req.user);
        res.render("search", {
          lat: req.body.lat,
          lng: req.body.lng,
          data: dbItem,
          title: "sharemyski - the best place to find gear",
          loggedIn: true,
          user: req.user
        });
      } else {
        res.render("search", {
          lat: req.body.lat,
          lng: req.body.lng,
          data: dbItem,
          title: "sharemyski - the best place to find gear",
          loggedIn: false
        });
      }
    });
  });

  app.get("/rent/:id", function (req, res) {
    db.Item.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: db.User
      }]
    }).then(function (dbItem) {
      console.log(dbItem);
      if (req.user) {
        console.log(req.user);
        res.render("rent", {
          data: dbItem,
          title: "sharemyski - rent gear",
          loggedIn: true,
          user: req.user
        });
      } else {
        res.redirect("/login");
      }
    });
  });

  app.get("/admin/item", function (req, res) {

    if (req.user && req.user.admin) {  // requires admin priv
      console.log(req.user)
      // check if user is admin
      res.render("item", {
        all: true
      });
    }
    else res.render("404");
  });

  app.get("/admin/user", function (req, res) {
    if (req.user && req.user.admin) {  // requires admin priv
      res.render("user");
    }
    else res.render("404");
  });

  app.get("/admin/transaction", function (req, res) {
    if (req.user && req.user.admin) {  // requires admin priv
      res.render("transaction");
    }
    else res.render("404");
  });

  app.get("/admin/location", function (req, res) {
    if (req.user && req.user.admin) {  // requires admin priv
      res.render("location");
    }
    else res.render("404");
  });

  app.get("/admin/category", function (req, res) {
    if (req.user && req.user.admin) {  // requires admin priv
      res.render("category");
    }
    else res.render("404");
  });

  app.get("/allrentals", function (req, res) {
    // if users is admin
    db.Example.findAll({ Items }).then(function (dbExamples) {
      res.render("allrentals", {
        authorized: "1",
        msg: "Welcome!",
        examples: dbExamples
      });
    });
    // otherwise send unathorized message
    res.render("notauthorized", {
      msg: "Welcome!",
      examples: dbExamples
    });
  });

  app.get("/about", function (req, res) {
    if (req.user) {
      console.log(req.user);
      res.render("about", {
        title: "sharemyski - the best place to find gear",
        loggedIn: true,
        user: req.user
      });
    } else {
      res.render("about", {
        title: "sharemyski - the best place to find gear",
        loggedIn: false
      });
    }
  });


  // Authentication Routes
  app.get("/signup", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.render("auth/signup", {
      title: "sharemyski Signup"
    });
  });
  app.get("/login", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/");
    }
    //res.sendFile(path.join(__dirname, "../public/login.html"));
    res.render("auth/login", {
      title: "sharemyski Login"
    });
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

  // =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
  }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/failedAuth'
    }));

  // route for a failed facebook authentication out
  app.get('/failedAuth', function (req, res) {
    console.log("Failed Facebook Auth " + req);
    req.logout();
    res.render("auth/failedAuth", {
      title: "sharemyski Failed Facebook Authentication"
    });
  });

  // route for logging out
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    if (req.user) {
      console.log(req.user);
      res.render("404", {
        title: "sharemyski - page not found",
        loggedIn: true,
        user: req.user
      });
    } else {
      res.render("404", {
        title: "sharemyski - page not found",
        loggedIn: false
      });
    }
  });
};