const {Router} = require('express');
const {Authorization} = require('../middlewares/auth');

const {HandleNewTwitt , getAllTwitts, sendHashtags, HandleLikesCount, handleTweetsByHashtags , handleTweetByUser } = require('../controllers/twittcontroller');
const { handleUsers } = require('../controllers/usercontroller');

const router = new Router;

router.post("/newTwitt" ,Authorization, HandleNewTwitt);

router.get("/twitts" , getAllTwitts);

router.get("/users" , handleUsers);

router.get("/hashtags" , sendHashtags);

router.post("/likes" , HandleLikesCount)

router.post("/TweetByHashtags" , handleTweetsByHashtags);

router.post("/TweetByUsers" , handleTweetByUser);




module.exports = router
