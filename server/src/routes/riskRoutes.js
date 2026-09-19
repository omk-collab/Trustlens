const express = require("express");

const { analyzeFinancialRisk } = require("../controllers/riskController");

const router = express.Router();

router.get("/financial/:projectId", analyzeFinancialRisk);

module.exports = router;
