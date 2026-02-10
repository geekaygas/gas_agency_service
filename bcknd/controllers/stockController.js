const Stock = require("../models/stockModel");
const DeleteOtp = require("../models/deleteOtp");
const {sendDeleteOtp} = require("../utils/EmailServices");

exports.createStock = async (req, res) => {
  try {
    const stock = new Stock(req.body);
    await stock.save();

    res.status(201).json({
      success: true,
      message: "Stock added successfully",
      data: stock,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getStocks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const filter = req.query.filter || "all";

  let query = {};

  if (search) {
    if (filter === "provider") {
      query.Provider = { $regex: search, $options: "i" };
    } else if (filter === "driver") {
      query.Drivername = { $regex: search, $options: "i" };
    } else if (filter === "staff") {
      query.Staffname = { $regex: search, $options: "i" };
    } else {
      query.$or = [
        { Provider: { $regex: search, $options: "i" } },
        { Drivername: { $regex: search, $options: "i" } },
        { Staffname: { $regex: search, $options: "i" } },
      ];
    }
  }

  const total = await Stock.countDocuments(query);

  const data = await Stock.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json({
    data,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
};


exports.requestDeleteOtp = async (req, res) => {
  try {
    const { stockId } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await DeleteOtp.deleteMany({ stockId });

    await DeleteOtp.create({
      stockId,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendDeleteOtp(otp);

    res.json({
      success: true,
      message: "OTP sent to registered email",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "OTP send failed" });
  }
};

exports.verifyOtpAndDelete = async (req, res) => {
  try {
    const { stockId, otp } = req.body;

    const record = await DeleteOtp.findOne({ stockId, otp });

    if (!record)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (record.expiresAt < new Date())
      return res.status(400).json({ success: false, message: "OTP expired" });

    await Stock.findByIdAndDelete(stockId);
    await DeleteOtp.deleteMany({ stockId });

    res.json({ success: true, message: "Stock deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

// exports.deleteStock = async (req, res) => {
//   await Stock.findByIdAndDelete(req.params.id);
//   res.json({ success: true, message: "Stock deleted" });
// };


exports.updateStock = async (req, res) => {
  const updated = await Stock.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({
    success: true,
    message: "Stock updated",
    data: updated,
  });
};
