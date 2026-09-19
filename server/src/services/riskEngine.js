const Project = require("../models/Project");
const { reconcileProjectFunds } = require("./fundReconciliation");
const { analyzeProjectTimeline } = require("./progressRisk");

const getRiskLevel = (score) => {
  if (score <= 30) {
    return "LOW";
  }

  if (score <= 60) {
    return "MEDIUM";
  }

  if (score <= 80) {
    return "HIGH";
  }

  return "CRITICAL";
};

const calculateFinancialRisk = async (projectId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const reconciliation = await reconcileProjectFunds(projectId);
  const timeline = await analyzeProjectTimeline(projectId);

  let financialScore = 0;
  let timelineScore = 0;

  const factors = [];

  if (reconciliation.difference !== 0) {
    financialScore = 30;
    factors.push("FINANCIAL_MISMATCH");
  }

  if (timeline.timelineRisk === "DELAY_DETECTED") {
    timelineScore = 20;
    factors.push("TIMELINE_DELAY");
  }

  const totalScore = financialScore + timelineScore;
  const riskLevel = getRiskLevel(totalScore);

  return {
    projectId,
    riskScore: totalScore,
    riskLevel,
    factors,

    financial: {
      score: financialScore,
      reconciliation,
    },

    timeline: {
      score: timelineScore,
      ...timeline,
    },
  };
};

module.exports = {
  calculateFinancialRisk,
};
