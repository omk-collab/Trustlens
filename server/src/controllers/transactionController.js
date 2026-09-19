const Transaction = require("../models/Transaction");

const { reconcileProjectFunds } = require("../services/fundReconciliation");

const createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create transaction",
      error: error.message,
    });
  }
};

const getProjectTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      projectId: req.params.projectId,
    }).sort({ transactionDate: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};

const reconcileFunds = async (req, res) => {
  try {
    const result = await reconcileProjectFunds(req.params.projectId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to reconcile project funds",
      error: error.message,
    });
  }
};

module.exports = {
  createTransaction,
  getProjectTransactions,
  reconcileFunds,
};
