const express = require("express");
const router = express.Router();
const { createStock, getStocks, updateStock, deleteStock, } = require("../controllers/stockController");

router.get("/stocks", getStocks);
router.put("/stocks/:id", updateStock);
router.delete("/stocks/:id", deleteStock);
router.post("/stocks", createStock);

module.exports = router;
