const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    contact: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      avatar: { type: String, default: "👤" },
    },

    emailProvider: {
      type: String,
      enum: ["Google", "Microsoft", "Zoho", "Custom"],
      default: "Google",
    },

    domains: {
      type: [String],
      required: true,
    },

    emailUsage: {
      used: { type: Number, default: 0 },
      total: { type: Number, default: 100 },
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    renewalDate: {
      type: Date,
    },

    domainCost: {
      type: Number,
      default: 0,
    },

    hostingCost: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", ClientSchema);
