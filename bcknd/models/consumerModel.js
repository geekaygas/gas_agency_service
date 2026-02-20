const mongoose = require("mongoose");

const consumerSchema = new mongoose.Schema(
  {
    Shopname: { 
      type: String, 
      required: true 
    },

    contactName: { 
      type: String,  
      required: true 
    },

    mobileNumber1: { 
      type: String, 
      required: true 
    },

    mobileNumber2: {
      type: String 
    },

    aadhaarNumber: { 
      type: String, 
    },
    gstNumber: { 
      type: String, 
    },

    address: { 
      type: String 
    },

    // ✅ NEW FIELDS
    gstNumber: { 
      type: String 
    },

    ownerImage: { 
      type: String  // Cloudinary URL
    },

    shopImage: { 
      type: String  // Cloudinary URL
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Consumer", consumerSchema);
