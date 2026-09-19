const Milestone = require("../models/Milestone");

const createMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.create(req.body);

    res.status(201).json({
      success: true,
      message: "Milestone created successfully",
      data: milestone,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create milestone",
      error: error.message,
    });
  }
};

const updateMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Milestone updated successfully",
      data: milestone,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update milestone",
      error: error.message,
    });
  }
};

const { analyzeProjectTimeline } = require("../services/progressRisk");

const analyzeTimeline = async (req, res) => {
  try {
    const result = await analyzeProjectTimeline(req.params.projectId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to analyze project timeline",
      error: error.message,
    });
  }
};

const getProjectMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({
      projectId: req.params.projectId,
    }).sort({ targetDate: 1 });

    res.status(200).json({
      success: true,
      count: milestones.length,
      data: milestones,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch milestones",
      error: error.message,
    });
  }
};

module.exports = {
  createMilestone,
  getProjectMilestones,
  updateMilestone,
  analyzeTimeline,
};
