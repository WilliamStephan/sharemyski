// Item TABLE CONFIG
module.exports = function (sequelize, DataTypes) {
    var Item = sequelize.define("Item", {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
        },
        inUse: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        start: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        end: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        daysRented: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        zip: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            defaultValue: "USA",
        },
        lng: {
            type: DataTypes.DOUBLE,
        },
        lat: {
            type: DataTypes.DOUBLE,
        },
        dayCost: {
            type: DataTypes.FLOAT(7, 2),
            defaultValue: 0,
        },
        xRented: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        equipRating: {
            type: DataTypes.FLOAT(7, 2),
            defaultValue: 0,
        },
        renterRating: {
            type: DataTypes.FLOAT(7, 2),
            defaultValue: 0,
        }
    });

    Item.associate = (models) => { // associations can be defined here
        Item.belongsTo(models.User, { constraints: false })
        Item.belongsTo(models.Category, { constraints: false })
    };

    return Item;
};