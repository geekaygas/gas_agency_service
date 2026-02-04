const express = require("express");
const router = express.Router();
const {
  requestSignupOtp,
  verifySignupOtp,
  setPassword,
  login,
  requestForgotOtp,
  resetPassword,
  logout,
} = require("../controllers/authController");
// Sign up
router.post("/signup/request-otp", requestSignupOtp);
router.post("/signup/verify-otp", verifySignupOtp);
router.post("/signup/set-password", setPassword);
// Login
router.post("/login", login);

// Forgot password
router.post("/forgot/request-otp", requestForgotOtp);
router.post("/forgot/reset-password", resetPassword);
router.post("/logout", logout);

module.exports = router;