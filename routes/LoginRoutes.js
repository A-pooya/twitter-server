const {Router} = require('express');
const {HandleLogin, HandleRegister, HandleProfileImage,getProfile} = require('../controllers/usercontroller');

const router = new Router;

 
router.post("/login" , HandleLogin);

router.post("/register", HandleRegister);

router.post("/image", HandleProfileImage);

router.get("/getProfile", getProfile)

module.exports = router