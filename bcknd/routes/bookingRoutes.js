const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,getInventoryStats,getShopTransactions
} = require("../controllers/bookingController");

router.post("/bookings", createBooking);
router.get("/bookings", getBookings);
router.get("/inventory", getInventoryStats);
router.get("/shop-transactions/:consumerId", getShopTransactions)
module.exports = router;
