require('dotenv').config();

const dotenvConfig = process.env;

const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    dotenvConfig.DATABASE_NAME,
    dotenvConfig.USER,
    dotenvConfig.PASSWORD,
    {
        dialect: 'mysql',
        host: dotenvConfig.HOST
    }
);

module.exports = sequelize;