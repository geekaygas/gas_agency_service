const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // 🔹 RELATION (MOST IMPORTANT)
    consumerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consumer",
      required: true,
      index: true, // 🔥 performance
    },

    // 🔹 SNAPSHOT FIELDS (for history)
    Shopname: { type: String, required: true },
    contactName: { type: String, required: true },
    mobileNumber1: { type: String, required: true },

    cylinderType: {
      type: String,
      enum: ["19 Kg", "5 kg", "Nano Cut"],
      required: true,
    },

    // 🔹 19 Kg
    kg19FullQty: { type: Number, default: 0, min: 0 },
    kg19EmptyQty: { type: Number, default: 0, min: 0 },

    // 🔹 5 Kg
    kg5FullQty: { type: Number, default: 0, min: 0 },
    kg5EmptyQty: { type: Number, default: 0, min: 0 },

    // 🔹 Nano
    nanoFullQty: { type: Number, default: 0, min: 0 },
    nanoEmptyQty: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
