const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    Provider: { type: String, required: true },
    Drivername: { type: String, required: true },
    Staffname: { type: String, required: true },
    date: { type: String },
    time: { type: String },
    cylinder19: { type: Number, default: 0 },
    cylinder5: { type: Number, default: 0 },
    nanoCut: { type: Number, default: 0 },
    cylinder19mt: { type: Number, default: 0 },
    cylinder5mt: { type: Number, default: 0 },
    nanoCutmt: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);
