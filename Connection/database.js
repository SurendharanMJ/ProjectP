// const mySQL = require('mysql2');

// const DB = mySQL.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'cart',
//     port: 3306

// });
// module.exports = DB.promise();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("cart", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

module.exports = sequelize;
