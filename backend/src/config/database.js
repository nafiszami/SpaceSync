const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'spacesync',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'mysql',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;
