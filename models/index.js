"use strict";
require("dotenv").config();
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var db = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter(function (file) {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// SEED CATEGORY TABLE MODEL FUNCTION **********
function seedCategory() {
  db.Category.create({
    description: "Skis - Downhill",
  });
  db.Category.create({
    description: "Skis - Cross-Country",
  });
  db.Category.create({
    description: "Snow Boards",
  });
  db.Category.create({
    description: "Snow Shoes",
  });
  db.Category.create({
    description: "Sleds / Toboggans",
  });
}

// SEED USER TABLE MODEL FUNCTION **********
function seedUser() {
  db.User.create({
    name: "Edward Bobby",
    password: "$2a$10$N2tQN1SBUrpdwOYriwD34OpprgauryhQytMgjo.6BXVCnV6XcS.gS",
    fbId: "N/A",
    fbToken: "",
    address: "222 E 6th Street",
    city: "Austin",
    state: "Texas",
    zip: "78702",
    Country: "USA",
    email: "edward@gmail.net",
    phone: "512-799-5555",
    xOwner: 1,
    xRenter: 1,
    renterRatingAvg: 3,
    equipRatingAvg: 2,
    admin: false,
    active: true,
    rents: true,
    owns: true
  });
  db.User.create({
    name: "Bobby Edwards",
    password: "$2a$10$dxVhgzlQprDNjvtIlRMXBuLzMaAMXkfy8ngRK40fHhz/BV5tv9F9O",
    fbId: "N/A",
    fbToken: "",
    address: "777 W 6th Street",
    city: "Austin",
    state: "Texas",
    zip: "78702",
    Country: "USA",
    email: "bobby@gmail.net",
    phone: "512-997-5555",
    xOwner: 1,
    xRenter: 1,
    renterRatingAvg: 3,
    equipRatingAvg: 2,
    admin: false,
    active: true,
    rents: true,
    owns: false
  });
  db.User.create({
    name: "Bill Stephan",
    password: "$2a$10$KpV8ybd5JCgLMxStXSfQq.tQ4UUre6Ut87EHdf5CcgaPzlK.NgV7K",
    fbId: "10222313904457070",
    fbToken: "",
    address: "9904 Spicewood Mesa",
    city: "Austin",
    state: "Texas",
    zip: "78759",
    Country: "USA",
    email: "me@billstephan.com",
    phone: "512-997-8948",
    xOwner: 1,
    xRenter: 1,
    renterRatingAvg: 3,
    equipRatingAvg: 2,
    admin: true,
    active: true,
    rents: true,
    owns: true,
  });
}

// SEED ITEM TABLE MODEL FUNCTION **********
function seedItem() {
  db.Item.create({
    UserId: 1,
    CategoryId: 1,
    inUse: false,
    start: 0,
    end: 0,
    daysRented: 0,
    address: "9904 Spicewood Mesa",
    city: "Austin",
    state: "Texas",
    zip: "78759",
    Country: "USA",
    lat: "30.4156427",
    lng: "-97.7903354",
    dayCost: 40,
    xRented: 0,
    equipRating: 4.5,
    description: "193 - Fischer RC4 WC GS Curv Boost Men's Race Skis with NA Bindings",
    image: "https://www.rei.com/media/ca768040-865e-42ad-88ca-0c60ffacd2c4?size=784x588",
  });
  db.Item.create({
    UserId: 1,
    CategoryId: 1,
    inUse: false,
    start: 0,
    end: 0,
    daysRented: 0,
    address: "777 W 6th Street",
    city: "Austin",
    state: "Texas",
    zip: "78702",
    Country: "USA",
    lat: "30.2701387",
    lng: "-97.7506732",
    dayCost: 20,
    xRented: 0,
    equipRating: 3.5,
    description: "176 - Rossignol Seek 7 HD Skis with Xpress 11 Bindings",
    image: "https://curated-uploads.imgix.net/AgAAAB0A5-9lHGDdMwykPMvyzf5RUA.jpg?auto=compress%2Cformat&q=75&fit=crop&ch=Width%2CDPR%2CSave-Data&ixlib=react-8.6.1&w=500&dpr=1"
  });
  db.Item.create({
    UserId: 3,
    CategoryId: 5,
    inUse: false,
    start: 0,
    end: 0,
    daysRented: 0,
    address: "222 E 6th Street",
    city: "Austin",
    state: "Texas",
    zip: "78702",
    Country: "USA",
    lat: "30.2674923",
    lng: "-97.7406062",
    dayCost: 40,
    xRented: 0,
    equipRating: 2.5,
    description: "Red Plastic Snow Saucer",
    image: "https://static.turbosquid.com/Preview/2016/12/28__03_36_39/SnowSaucer3dsmodel003.jpg5C82C94A-1B0E-4094-A16C-56102670CAB7DefaultHQ.jpg"
  });
}

// SEED TRANSACTION TABLE MODEL FUNCTION **********
function seedTrans() {
  db.Transaction.create({
    ownerId: 1,
    renterId: 2,
    tranDate: 0,
    daysRented: 4,
    tranValue: 160,
    itemId: 1
  });
  db.Transaction.create({
    ownerId: 1,
    renterId: 3,
    tranDate: 0,
    daysRented: 4,
    tranValue: 160,
    itemId: 2
  });
  db.Transaction.create({
    ownerId: 3,
    renterId: 2,
    tranDate: 0,
    daysRented: 4,
    tranValue: 160,
    itemId: 3
  });
}
if (process.env.NODE_SEED === "yes") {
  setTimeout(() => {
    seedUser();
    seedCategory();
    seedItem();
    seedTrans();
  }, 2000);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
