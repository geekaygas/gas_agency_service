const express = require("express");
const router = express.Router();
const { addClient,getClients,updateClient,deleteClient} = require("../controllers/clientController");

router.post("/clients", addClient);
router.get("/clients", getClients);
router.put("/clients/:id", updateClient);
router.delete("/clients/:id", deleteClient);

module.exports = router;
