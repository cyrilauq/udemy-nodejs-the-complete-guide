require('dotenv').config();

const mysql = require('mysql2');

const dotenvConfig = process.env;

const pool = mysql.createPool({
    host: dotenvConfig.HOST,
    user: dotenvConfig.USER,
    database: dotenvConfig.DATABASE_NAME,
    password: dotenvConfig.PASSWORD
});

module.exports = pool.promise();