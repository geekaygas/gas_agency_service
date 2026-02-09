const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/authModel");
const {sendOTP,sendPasswordResetOtp} = require("../utils/EmailServices");

// Generate 4-digit OTP
const generateOTP = () =>
  Math.floor(1000 + Math.random() * 9000).toString();

exports.requestSignupOtp = async (req, res) => {
  try {
    console.log("STEP 1: Body", req.body);

    const { name, email } = req.body;

    let user = await User.findOne({ email });
    console.log("STEP 2: User found", user);

    const otp = generateOTP();

    if (!user) {
      user = new User({ name, email });
    }

    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    console.log("STEP 3: Before save");
    await user.save();
    console.log("STEP 4: After save");

    console.log("STEP 5: Before sendOTP");
    await sendOTP(email, otp);
    console.log("STEP 6: After sendOTP");

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("REQUEST OTP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// exports.requestSignupOtp = async (req, res) => {
//   try {
//     const { name, email } = req.body;

//     if (!name || !email) {
//       return res.status(400).json({ message: "Name and Email required" });
//     }

//     let user = await User.findOne({ email });

//     // If user exists & verified → block
//     if (user && user.isVerified) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // If OTP expired → clear it automatically
//     if (user && user.otpExpiresAt && user.otpExpiresAt < new Date()) {
//       user.otp = undefined;
//       user.otpExpiresAt = undefined;
//     }

//     // If OTP still valid → block resend
//     if (user && user.otpExpiresAt > new Date()) {
//       return res.status(429).json({ message: "OTP already sent. Please wait." });
//     }

//     const otp = generateOTP();

//     if (!user) {
//       user = new User({ name, email });
//     }

//     user.otp = otp;
//     user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

//     await user.save();
//     await sendOTP(email, otp);

//     res.status(200).json({ message: "OTP sent successfully" });
//   } 
//   catch (err) {
//   console.error("REQUEST OTP ERROR:", err);
//   res.status(500).json({ message: err.message });
// }

// };

/**
 * STEP 2: VERIFY OTP
 */
exports.verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      user.otpExpiresAt < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * STEP 3: SET PASSWORD
 */
exports.setPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ email, isVerified: true });

    if (!user) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Account created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email, isVerified: true });

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔐 CREATE TOKEN
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    // ✅ SEND SAFE USER DATA (NO PASSWORD)
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.requestForgotOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isVerified: true });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();
    await sendPasswordResetOtp(email, otp);

    res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ email, isVerified: true });

    if (!user) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.otp = null;
    user.otpExpiresAt = null;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  // JWT logout is stateless (frontend clears token)
  res.status(200).json({ message: "Logged out successfully" });
};