const express = require("express");
const router = express.Router();
const { createStock, getStocks, updateStock, deleteStock,requestDeleteOtp,verifyOtpAndDelete } = require("../controllers/stockController");

router.get("/stocks", getStocks);
router.put("/stocks/:id", updateStock);
// router.delete("/stocks/:id", deleteStock);
router.post("/stocks", createStock);
router.post("/stocks/request-delete-otp", requestDeleteOtp);
router.post("/stocks/verify-delete-otp", verifyOtpAndDelete);

module.exports = router;
