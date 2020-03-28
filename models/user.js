// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");

// USER TABLE CONFIG
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        // The password cannot be null
        password: {
            type: DataTypes.STRING,
            defaultValue: "N/A",
            allowNull: false
        },
        fb_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fbToken: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        zip: {
            type: DataTypes.STRING
        },
        country: {
            type: DataTypes.STRING,
            defaultValue: "USA",
        },
        phone: {
            type: DataTypes.STRING
        },
        xOwner: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        xRenter: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        equipRatingAvg: {
            type: DataTypes.FLOAT(7, 2),
            defaultValue: 0,
        },
        renterRatingAvg: {
            type: DataTypes.FLOAT(7, 2),
            defaultValue: 0,
        },
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        rents: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        owns: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    // Check to see if user is an admin
    // User.prototype.isAdmin = function (id) {
    //     return bcrypt.compareSync(password, this.password);
    // };
    // Hooks are automatic methods that run during various phases of the User Model lifecycle
    // In this case, before a User is created, we will automatically hash their password
    User.addHook("beforeCreate", function (user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });

    return User;
};