const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,getInventoryStats
} = require("../controllers/bookingController");

router.post("/bookings", createBooking);
router.get("/bookings", getBookings);
router.get("/inventory", getInventoryStats);

module.exports = router;
