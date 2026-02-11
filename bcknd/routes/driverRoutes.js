const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");

//forget vereify pass method 1
router.post("/driver-forget-otp", driverController.requestForgotOtp);
//forget vereify pass method 2
router.post("/driver-forget-verify", driverController.verifyforgetOtp);
//forget vereify pass method 3
router.post("/driver-resetPassword", driverController.resetPassword);


//login route
router.post("/signin", driverController.signIn);


//create account method 1
router.post("/signup/send-otp", driverController.signupSendOtp);
//method 2
router.post("/signup/verify-otp", driverController.signupVerifyOtp);
//method 3
router.post("/signup/set-password", driverController.signupSetPassword);



module.exports = router;
