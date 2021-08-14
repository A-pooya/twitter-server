const sequelize = require('../config/database');
const {DataTypes} = require('sequelize');
const Twitts = require('./twitts');

const Users = sequelize.define("Users",{
 id:{
     type:DataTypes.INTEGER,
     autoIncrement:true,
     primaryKey:true,
     allowNull:false,
    },
 fullname:{
     type:DataTypes.STRING(50),
     allowNull:false,
 },
 email:{
     type:DataTypes.STRING,
     allowNull:false,
     
 },
 password:{
     type:DataTypes.STRING,
     allowNull:false,
},
username:{
    type:DataTypes.STRING(50),
    unique:true,
    allowNull:false,
},
image:{
    type:DataTypes.STRING,
    allowNull:true,
    defaultValue:"/images/userimage.png"
     
}
},

)

module.exports = Users;

