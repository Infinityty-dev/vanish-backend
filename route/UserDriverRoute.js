// const express = require('express')
// const router = express.Router()
// const { driverImage } = require("../database/multer.js");
// const {userSignUp, userSignIn,driverSignUp, driverSignIn} = require('../controllers/UserAndDriverControl.js')

// //,carImage

// router.post('/userSignup',userSignUp)
// router.post('/userSignin',userSignIn)
// router.post('/driverSignup',driverSignUp)
// router.post('/driverSignup',driverImage)
// router.post('/driverSignin',driverSignIn)

// //carImage,


// module.exports = router

const express = require('express');
const router = express.Router();
const { driverImage } = require("../database/multer.js");
const {
  userSignUp,
  userSignIn,
  driverSignUp,
  driverSignIn,
} = require('../controllers/UserAndDriverControl.js');

// User Routes
router.post('/userSignup', userSignUp);
router.post('/userSignin', userSignIn);

// Driver Routes with image upload middleware
router.post('/driverSignup', driverImage, driverSignUp);
router.post('/driverSignin', driverSignIn);

module.exports = router;
