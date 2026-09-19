const express = require("express");

const {
  createTransaction,
  getProjectTransactions,
  reconcileFunds,
  
} = require("../controllers/transactionController");

const router = express.Router();

router.post("/", createTransaction);

router.get("/project/:projectId", getProjectTransactions);

router.get("/reconcile/:projectId", reconcileFunds);

module.exports = router;
