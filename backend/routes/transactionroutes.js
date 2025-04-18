const express = require("express");
const router = express.Router();

const { handleSmsTransaction } = require("../controllers/transactioncontroller.js");
const verifyToken = require("../middleware/verifytoken");

// POST /api/transactions/from-sms
router.post("/from-sms", verifyToken, handleSmsTransaction);

module.exports = router;
