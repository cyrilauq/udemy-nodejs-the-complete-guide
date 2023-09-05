const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Cart = require('./cart');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

module.exports = Product;