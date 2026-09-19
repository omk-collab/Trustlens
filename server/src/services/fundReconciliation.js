const Transaction = require("../models/Transaction");
const Project = require("../models/Project");

const reconcileProjectFunds = async (projectId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const transactions = await Transaction.find({
    projectId,
    transactionType: "PAYMENT",
  });

  const totalTransactions = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

  const spentAmount = project.financial.spentAmount;

  const difference = spentAmount - totalTransactions;

  return {
    projectId,
    spentAmount,
    totalTransactions,
    difference,
    status: difference === 0 ? "MATCHED" : "MISMATCH",
  };
};

module.exports = {
  reconcileProjectFunds,
};
