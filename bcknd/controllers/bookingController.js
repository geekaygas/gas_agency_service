const Booking = require("../models/bookingModel");
const Stock = require("../models/stockModel");

exports.createBooking = async (req, res) => {
  try {
    const {
      consumerId,
      Shopname,
    } = req.body;

    if (!consumerId || !Shopname ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const booking = new Booking(req.body);
    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { date } = req.query; // 👈 NEW

    const skip = (page - 1) * limit;

    let query = {};

    // 🔹 FILTER BY DATE
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    const total = await Booking.countDocuments(query);

    const data = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

exports.getShopTransactions = async (req, res) => {
  try {
    const { consumerId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    if (!consumerId) {
      return res.status(400).json({
        success: false,
        message: "Consumer ID is required",
      });
    }

    const total = await Booking.countDocuments({ consumerId });

    const data = await Booking.find({ consumerId })
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch shop transactions",
      error: error.message,
    });
  }
};

exports.getInventoryStats = async (req, res) => {
  try {
    /* 🔹 1. AGGREGATE STOCK TOTALS */
    const stockAgg = await Stock.aggregate([
      {
        $group: {
          _id: null,
          full19: { $sum: "$cylinder19" },
          empty19: { $sum: "$cylinder19mt" },

          full5: { $sum: "$cylinder5" },
          empty5: { $sum: "$cylinder5mt" },

          fullNano: { $sum: "$nanoCut" },
          emptyNano: { $sum: "$nanoCutmt" },
        },
      },
    ]);

    const stock = stockAgg[0] || {
      full19: 0,
      empty19: 0,
      full5: 0,
      empty5: 0,
      fullNano: 0,
      emptyNano: 0,
    };

    /* 🔹 2. AGGREGATE BOOKING TOTALS */
    const bookingAgg = await Booking.aggregate([
      {
        $group: {
          _id: null,
          booked19Full: { $sum: "$kg19FullQty" },
          booked19Empty: { $sum: "$kg19EmptyQty" },

          booked5Full: { $sum: "$kg5FullQty" },
          booked5Empty: { $sum: "$kg5EmptyQty" },

          bookedNanoFull: { $sum: "$nanoFullQty" },
          bookedNanoEmpty: { $sum: "$nanoEmptyQty" }, 
        },
      },
    ]);

    const booked = bookingAgg[0] || {
      booked19Full: 0,
      booked19Empty: 0,
      booked5Full: 0,
      booked5Empty: 0,
      bookedNanoFull: 0,
      bookedNanoEmpty: 0,
    };

    /* 🔹 3. FINAL REMAINING STOCK */
    const stats = {
      full19: Math.max(stock.full19 - booked.booked19Full, 0),
      empty19: Math.max(stock.empty19 - booked.booked19Empty, 0),

      full5: Math.max(stock.full5 - booked.booked5Full, 0),
      empty5: Math.max(stock.empty5 - booked.booked5Empty, 0),

      nanoFull: Math.max(stock.fullNano - booked.bookedNanoFull, 0),
      nanoEmpty: Math.max(stock.emptyNano - booked.bookedNanoEmpty, 0),
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory stats",
      error: error.message,
    });
  }
};