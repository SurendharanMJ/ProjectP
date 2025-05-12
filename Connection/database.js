const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("cart", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

module.exports = sequelize;
