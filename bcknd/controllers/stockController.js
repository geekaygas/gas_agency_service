const Stock = require("../models/stockModel");

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


exports.deleteStock = async (req, res) => {
  await Stock.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Stock deleted" });
};


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
