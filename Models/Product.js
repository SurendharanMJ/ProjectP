const { DataTypes } = require("sequelize")
const DB = require("../Connection/database")
const database = require("../Connection/database")

const Product = DB.define("Products", {
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Product_cat: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.STRING
    },
    price: {
        type:DataTypes.BIGINT
    },
     auth_id:{
        type: DataTypes.INTEGER
    }
},
{
        timestamps: false,
        freezeTableName: true,
})


module.exports = Product;