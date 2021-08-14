const bcrypt = require('bcryptjs');
const Users = require('../models/User');
const jwt = require('jsonwebtoken');
const rootdir = require('app-root-path');
const shortid = require('shortid');
const sharp = require('sharp');

exports.HandleLogin = async (req , res , next) => {
    try {
        const {email,password} = req.body;
        const user = await Users.findOne({where:{email}}) //*این خط کد میره کل اطلاعات کاربر رو که تو پلیگاه داده ثبت شده میگیره میاره نه فقط ایمیلشو
        if(!user){
           const error = new Error("کاربری با این ایمیل یافت نشد. لطفا ابتدا ثبت نام کنید");
           error.statusCode = 404;
           throw error;
        }

            const ismatch = await bcrypt.compare(password , user.password)
            if(!ismatch){
                const error = new Error("نام کاربری یا رمزعبور صحیح نمی‌باشد");
                error.statusCode = 404;
                throw error;
            }
        else{
            const token = await jwt.sign({user:{
                
                fullname:user.fullname,
                email:user.email,
            }
        } , 
            process.env.TOKENPASS )

            res.status(200).json({message:"شما با موفقیت وارد شدید",token , name:user.fullname , username:user.username})

            
        }
    } catch (err) {
        next(err)
    }

}
//!-------------------------------------------------------

exports.HandleRegister = async (req ,res ,next) => {
    try {
        
        const {username ,  fullname , email , password } = req.body;
        const findbyusername = await Users.findOne({where:{username}})
        if(findbyusername){
            const error = new Error("لطفا نام کاربری دیگری انتخاب کنید")
            error.statusCode = 400;
            throw error; 
        }
         const user = await Users.findOne({where:{email}})
          if(user){
          const error = new Error("کاربری با این ایمیل ثبت نام کرده است");
          error.statusCode = 400;
          throw error;   
         }

     else{
            const hashpass = await bcrypt.hash(password , 10);
            await Users.create({
                username,
                fullname,
                email,
                password:hashpass,
            });
            const token = await jwt.sign({user:{
                fullname,
                email
            }
        } , 
            process.env.TOKENPASS )
          
            res.status(200).json({message:"به توییتر فارسی خوش آمدید" ,token , name:fullname , username:username})
        }
        
    } catch (err) {
        console.log(err);
        
        next(err)
    }
}
//!-------------------------------------------------------

exports.HandleProfileImage = async (req , res , next) => {
  const {username} = req.body;
  console.log(req.body);
   const profileImage = req.files.image;
   const filename = `${shortid.generate()}_${profileImage.name}`;
   const filesave = `${rootdir}/public/images/${filename}`

try {
     await sharp(profileImage.data).jpeg({quality:60}).png({quality:60}).toFile(filesave).catch(err => {console.log(err);})
    

  const user =  await Users.findAll({ where: { username:username } })
  if(user){
      await Users.update({image : filesave},{where:{username:username}}) //برای استفاده از متد آپدیت تو پارامتر اول بهش میگیم چیرو آچدیت کنه تو پارامتر دوم میگیم قسمت جدول رو آپدیت کنه
      return res.status(200).json({message:"عکس شما در پایگاه داده ثبت گردید" , imageaddress:`http://localhost:3000/public/images/${filename}`})

  }
  else{
    const error = new Error("عکس شما در پایگاه داده ثبت نشد");
    error.statusCode = 400;
    throw error; 
  }

  
 
   
    
    
} catch (error) {
    console.log(error);
    next(error)
}


}
//!-------------------------------------------------------

exports.handleUsers = async (req ,res ,next) => {
       try {
           const users = await Users.findAll({limit:5 ,attributes:["fullname" , "username" ,"image" ]})
           if(users){
               res.status(200).json({users})
           }
           else{
            const error = new Error("عکس شما در پایگاه داده ثبت نشد");
            error.statusCode = 400;
            throw error; 
           }
           
       } catch (err) {
           console.log(err);
           next(err)
           
       }
}

//!-------------------------------------------------------
exports.getProfile = async(req ,res ,next) => {
    try {
        const token = req.get("Authorization")
        console.log(token);
        if(!token){
            const error = new Error("لطفا مجددا وارد شوید");
            error.statusCode = 401;
            throw error; 
        }
        const decodedToken = await jwt.verify(token , process.env.TOKENPASS)
        if(!decodedToken){
            const error = new Error("شما مجوز کافی برای مشاهده سایت را ندارید. لطفا مجددا وارد شوید");
            error.statusCode = 401;
            throw error; 
        }
        const email = decodedToken.user.email
        const user = await Users.findOne({where:{email:email}})

        res.status(200).json({token , fullname:user.fullname ,image:user.image , username:user.username})
        
    } catch (err) {
        next(err)
    }
}


