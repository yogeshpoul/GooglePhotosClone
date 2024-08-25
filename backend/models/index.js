// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
console.log("reached here",process.env.DATABASE_NAME,process.env.DB_USERNAME)

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  // other options
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
