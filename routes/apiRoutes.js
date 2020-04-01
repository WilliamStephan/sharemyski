let db = require("../models");
let passport = require("../config/passport");

module.exports = function (app) {

  // API to get Items
  app.get("/api/item/:id?", function (req, res) {
    let id = req.params.id;
    if (id) {
      db.Item.findOne({
        where: [{ id: id }],
        include: [db.User, db.Category]
      }).then(function (dbItem) {
        console.log(dbItem);
        res.json(dbItem);
      });
    } else {
      db.Item.findAll({
        include: [db.User, db.Category]
      }).then(function (dbItem) {
        console.log(dbItem);
        res.json(dbItem);
      });
    }
  });

  app.get("/api/user/:id?", function (req, res) {
    let id = req.params.id;
    if (id) {
      db.User.findOne({
        where: [{ id: id }]
      }).then(function (dbUser) {
        res.json(dbUser);
      });
    } else {
      db.User.findAll({}).then(function (dbUser) {
        res.json(dbUser);
      });
    }

  });

  app.get("/api/transaction/:id?", function (req, res) {
    let id = req.params.id;
    if (id) {
      db.Transaction.findOne({
        where: [{ id: id }]
      }).then(function (dbTransaction) {
        res.json(dbTransaction);
      });
    } else {
      db.Transaction.findAll({}).then(function (dbTransaction) {
        res.json(dbTransaction);
      });
    }
  });

  app.get("/api/category/:id?", function (req, res) {
    let id = req.params.id;
    if (id) {
      db.Category.findOne({
        where: [{ id: id }]
      }).then(function (dbCategory) {
        res.json(dbCategory);
      });
    } else {
      db.Category.findAll({}).then(function (dbCategory) {
        res.json(dbCategory);
      });
    }


  });


  app.post("/api/item", function (req, res) {
    console.log(req.body)
    db.Item.create({
      userId: req.body.puserid,
      description: req.body.pdescription,
      address: req.body.paddress,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      country: req.body.country,
      lng: req.body.lng,
      lat: req.body.lat,
      dayCost: req.body.dayCost,
      image: req.body.image
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });



  // delete item
  app.delete("/api/item/:id", function (req, res) {
    db.Item.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbItem) {
      res.json(dbItem);
    });
  });

  // delete user
  app.delete("/api/user/:id", function (req, res) {
    db.User.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  // delete category
  app.delete("/api/category/:id", function (req, res) {
    db.Category.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbCategory) {
      res.json(dbCategory);
    });
  });


  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
};
