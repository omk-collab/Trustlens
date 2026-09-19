const { calculateFinancialRisk } = require("../services/riskEngine");

const analyzeFinancialRisk = async (req, res) => {
  try {
    const result = await calculateFinancialRisk(req.params.projectId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to analyze financial risk",
      error: error.message,
    });
  }
};

module.exports = {
  analyzeFinancialRisk,
};
