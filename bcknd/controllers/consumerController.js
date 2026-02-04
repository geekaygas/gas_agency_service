const Consumer = require("../models/consumerModel");
const cloudinary = require("../utils/cloudinary");

// 🔹 CREATE CONSUMER
exports.createConsumer = async (req, res) => {
  try {
    const {
      Shopname,
      contactName,
      mobileNumber1,
      mobileNumber2,
      cylinderType,
      address,
      ownerImage,
      shopImage,
    } = req.body;

    const consumer = new Consumer({
      Shopname,
      contactName,
      mobileNumber1,
      mobileNumber2,
      cylinderType,
      address,
      ownerImage,
      shopImage,
    });

    await consumer.save();

    res.status(201).json({
      success: true,
      message: "Consumer added successfully",
      data: consumer,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 GET CONSUMERS (Pagination)
exports.getConsumers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const filter = req.query.filter || "all";

    let query = {};

    // 🔍 SEARCH (Shop / Contact / Mobile)
    if (search) {
      query.$or = [
        { Shopname: { $regex: search, $options: "i" } },
        { contactName: { $regex: search, $options: "i" } },
        { mobileNumber1: { $regex: search, $options: "i" } },
      ];
    }

    // 🔽 FILTER BY CYLINDER TYPE
    if (filter !== "all") {
      query.cylinderType = filter;
    }

    const total = await Consumer.countDocuments(query);

    const data = await Consumer.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      data,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch consumers",
      error: error.message,
    });
  }
};

exports.updateConsumer = async (req, res) => {
  const updated = await Consumer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({
    success: true,
    message: "Consumer updated",
    data: updated,
  });
};

// 🔹 DELETE CONSUMER
exports.deleteConsumer = async (req, res) => {
  await Consumer.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Consumer deleted" });
};
