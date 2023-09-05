const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Cart = require('./cart');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
    },
    firstname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
    },
    mail: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    pseudo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = User;