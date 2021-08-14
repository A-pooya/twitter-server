const sequelize = require('../config/database');
const {DataTypes} = require('sequelize');
const Users = require('./User');



const Twitts = sequelize.define("Twitt",{
    textid:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
       },
    text:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    hashtags:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    likes:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0,
    },
   count:{
       type:DataTypes.INTEGER,
       allowNull:true
   },
   img:{
       type:DataTypes.STRING,
       allowNull:true
   },
   username:{
       type:DataTypes.STRING,
       allowNull:false
   },
   name:{
    type:DataTypes.STRING,
    allowNull:false
   }
  
   },
)



module.exports = Twitts;