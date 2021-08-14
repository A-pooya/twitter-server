const express = require('express');
const dotenv = require('dotenv');
const fileupload = require('express-fileupload');
const {errorHandling} = require('./utils/errorHandling');
const {setHeaders} = require('./middlewares/CORS');
const sequelize = require('./config/database');
const LoginRoutes = require('./routes/LoginRoutes');
const TwittRoutes = require('./routes/TwittsRoutes');

const app = express();
 app.use(express.urlencoded({extended:false}));
 app.use(express.json());
 app.use(setHeaders);
 //*config env
 dotenv.config({path:'./config/configure.env'});
 
 app.use(fileupload());
 


 
 //*Routes
 app.use(LoginRoutes);
 app.use(TwittRoutes);
 
 //*errorhandler
 app.use(errorHandling);
 
 //*set Headers
 
 sequelize.sync().then(result => {
     console.log(result);
     app.listen(3000 , console.log("app is running on port 3000"));
    
    }).catch(err => console.log(err));

