const {Sequelize} = require('sequelize');

   const sequelize =  new Sequelize("twitter_db","root" , "980140636",{
            host:"localhost",
            dialect:"mysql"
        })
        
   

module.exports = sequelize;


