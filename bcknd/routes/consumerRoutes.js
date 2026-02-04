const express = require("express");
const router = express.Router();
const {
  createConsumer,
  getConsumers,
  updateConsumer,
  deleteConsumer,
} = require("../controllers/consumerController");

router.post("/consumers", createConsumer);
router.get("/consumers", getConsumers);
router.put("/consumers/:id", updateConsumer);
router.delete("/consumers/:id", deleteConsumer);

module.exports = router;
