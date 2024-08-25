// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres'
});

const User = require('./user')(sequelize, DataTypes);
const userPhotos=require('./userPhotos')(sequelize,DataTypes)

const db = {
  User,
  sequelize,
  Sequelize,
  userPhotos
};

module.exports = db;
// models/index.js (Add this at the end of the file)
db.sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  });

module.exports = db;
