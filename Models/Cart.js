const { DataTypes } = require("sequelize")
const DB = require("../Connection/database");
const Product = require("./Product");


const Cart = DB.define("Carts", {
    carts_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement: true
    },
    quantity: {
        type: DataTypes.INTEGER
    },
    type: {
        type: DataTypes.STRING
    },
    product_id:{
        type: DataTypes.INTEGER
    },
    product_category: {
        type: DataTypes.STRING
    },
     auth_id:{
        type: DataTypes.INTEGER
    }
},
{
        timestamps: false,
        freezeTableName: true,
})

module.exports = Cart;