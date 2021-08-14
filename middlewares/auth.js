const jwt = require('jsonwebtoken');

exports.Authorization = async (req , res , next) => {
 const authHeader = req.get("Authorization")
 
 try {
     if(!authHeader){
         const error = new Error("لطفا مجددا به سایت ورود کنید")
         error.statusCode = 401
         throw error
     }
     const decodedToken = await jwt.verify(authHeader , process.env.TOKENPASS)
     if(!decodedToken){
         const error = new Error("شما مجوز کافی برای انجام این عملیات را ندارید")
         error.statusCode = 401
         throw error
     }

     next()

 } catch (err) {
     next(err)
 }
}