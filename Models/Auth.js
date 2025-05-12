const { DataTypes } = require("sequelize")
const DB = require("../Connection/database")


const Auth = DB.define("Auth",{
    auth_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
            autoIncrement: true
    },
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    mobile:{
        type: DataTypes.BIGINT
    }

},
{
        timestamps: false,
        freezeTableName: true,
})


module.exports = Auth