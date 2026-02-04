const mongoose = require("mongoose");

const consumerSchema = new mongoose.Schema(
  {
    Shopname: { type: String, required: true },
    contactName: { type: String, required: true },
    mobileNumber1: { type: String, required: true },
    mobileNumber2: { type: String },
    cylinderType: { type: String, enum: ["19 Kg", "5 kg", "Nano Cut"] },
    address: { type: String },

    ownerImage: { type: String }, // Cloudinary URL
    shopImage: { type: String },  // Cloudinary URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Consumer", consumerSchema);
