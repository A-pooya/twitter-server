const Twitts = require('../models/twitts');
const sharp = require('sharp');
const shortid = require('shortid');
const rootdir = require('app-root-path');
const sequelize = require('../config/database');



exports.HandleNewTwitt = async (req , res , next) => {
   try { 
       const {text , hashtags , username ,name} = req.body;
       
       //*first case
       if(hashtags && req.files){
        const imageOfpost = req.files.img;
           const hashtagsArray = [];

         const filename = `${shortid.generate()}_${imageOfpost.name}`
         const filepath = `${rootdir}/image/${filename}`

         await sharp(imageOfpost.data)
         .jpeg({quality:60})
         .png({quality:60})
         .toFile(filepath)
         .catch(err => console.log(err))

        await Twitts.create({
            text,
            hashtags:hashtags,
            img:`http://localhost:3000/image/${filename}`,
            username,
            name
        })

        const sameHashtags = await Twitts.findAll({where:{hashtags:hashtags}})
        if(sameHashtags){
            await Twitts.increment({count:1},{where:{hashtags:hashtags}})
        }

        return res.status(200).json({message: "توییت شما با موفقیت ثبت شد" ,
         text ,
         postimagepath:`http://localhost:3000/image/${filename}`})
    }
    //*second case
    if(req.files && !hashtags){
        const imageOfpost = req.files.img;
        const filename = `${shortid.generate()}_${imageOfpost.name}`
        const filepath = `${rootdir}/image/${filename}`

        await sharp(imageOfpost.data)
        .jpeg({quality:60})
        .png({quality:60})
        .toFile(filepath)
        .catch(err => console.log(err))
       
       await Twitts.create({
           text,
           img:`http://localhost:3000/image/${filename}`,
           username,
           name,
           
       })
       return res.status(200).json({message: "توییت شما با موفقیت ثبت شد" ,
        text ,
         postimagepath:`http://localhost:3000/image/${filename}`})
    }
    //*third case
    if(hashtags && !req.files){
      
         await Twitts.create({
            text,
            hashtags:hashtags,
            username,
            name
        })

        const sameHashtags = await Twitts.findAll({where:{hashtags:hashtags}})
        if(sameHashtags){
            await Twitts.increment({count:1},{where:{hashtags:hashtags}})
        }

        return res.status(200).json({message: "توییت شما با موفقیت ثبت شد" ,text })
    }
    //*forth case
    else{
        await Twitts.create({
            text,
            username,
            name,
        })

       return res.status(200).json({message: "توییت شما با موفقیت ثبت شد(بدون هشتگ)" , text})
    }

    }
    

    catch (err) {
       console.log(err);
       const error = new Error("توییت شما در پایگاه داده ثبت نگردید")
       error.statusCode = 400;
       next(error)
   }
}

//!---------------------------------------------------------

exports.getAllTwitts = async (req ,res ,next) => {
try {
    const twitts = await Twitts.findAll();
        res.status(200).json({twitts})

} catch (err) {
       console.log(err);
       const error = new Error("ایرادی در ارسال توییت ها از سمت سرور رخ داده است")
       error.statusCode = 400;
       next(error)
}
}

//!-----------------------------------------------------------

exports.sendHashtags = async (req , res ,next) => {
    try { 
       const hashtags = await Twitts.findAll({attributes:["hashtags"]})
        
       const filter = hashtags.filter((item) => {
           return item.dataValues.hashtags !==null //in filter baraye ine ke oon hashtagayi ke barabare null hast ro joda konim ke be front ferestade nashe yani oon post hayi ke hashtagi nadaran joda beshan
        })
       
        const set = Array.from(new Set(filter.map(item => item.dataValues.hashtags))) //یکی از ویژگی های ست اینه که مقادیر تکراری قبول نمیکنه
         
         
        const slice = set.slice(0,5)//in khat baray limit kardane ke faqat ta 5 ta hashtag namayesh dade beshe
        console.log(slice);
        
      
        if(filter){
            res.status(200).json({filter:slice})
        }
        else{
            console.log(err);
            const error = new Error("هشتگی در پایگاه داده ثبت نشده است")
            error.statusCode = 400;
            throw error
        }

    } catch (err) {
        console.log(err);
        next(err)
    }
}

//!------------------------------------------------------------

exports.HandleLikesCount = async (req ,res, next) => {
    try {
        const {id} = req.body;
        
        await Twitts.increment({likes:1},{where:{textid:id}})
        return res.status(200).json({message:"پسندیده شد "})
    } catch (err) {
        console.log(err);
        const error = new Error("لایک شما ثبت نشد")
        error.statusCode = 400;
        next(error);
    }
}

//!------------------------------------------------------------
exports.handleTweetsByHashtags = async (req ,res ,next) => {
  try {
      const {hashtag} = req.body;
      console.log(hashtag);
      const postByHashtags = await Twitts.findAll({where:{hashtags:hashtag}})
      console.log(postByHashtags);
      res.status(200).json({post:postByHashtags,message:"پست ها بر اساس هشتگ ارسال شد"})

  } catch (err) {
    console.log(err);
    const error = new Error("پستی با این هشتگ یافت نشد")
    error.statusCode = 404;
    next(error)
  }
}
//!---------------------------------------------------------------
exports.handleTweetByUser = async(req ,res ,next) => {
try {
    const {username} = req.body;
    console.log(username);
    const tweetByUser = await Twitts.findAll({where:{username :username}})
    console.log(tweetByUser);
    if(tweetByUser){
        res.status(200).json({message:"پست های کاربر مورد نظر ارسال شد" ,postsByUser:tweetByUser})
    }
    else{
        const error = new Error("پستی یافت نشد")
        error.statusCode = 404;
        throw error
    }
    
} catch (err) {
    console.log(err);
    next(err)
}
}