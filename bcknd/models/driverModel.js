const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name:{type: String , required:true},
  email: { type: String, required: true, unique: true },
  phone: {type: String, required: true, unique: true},
  otp: { type: String },
  otpExpires: { type: Date },
  password: { type: String },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Driver", driverSchema)