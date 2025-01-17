const express = require('express')
const router = express.Router()
// const { driverImage,carImage } = require("../database/multer");
const {userSignUp, userSignIn,driverSignUp, driverSignIn} = require('../controllers/UserAndDriverControl.js')



router.post('/userSignup',userSignUp)
router.post('/userSignin',userSignIn)
router.post('/driverSignup',driverSignUp)
router.post('/driverSignin',driverSignIn)

//driverImage,carImage,


module.exports = router