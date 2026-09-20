const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid project ID",
      error: error.message,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const projects = await Project.find();

    const totalProjects = projects.length;

    const totalSanctionedAmount = projects.reduce(
      (total, project) => total + project.financial.sanctionedAmount,
      0,
    );

    const totalSpentAmount = projects.reduce(
      (total, project) => total + project.financial.spentAmount,
      0,
    );

    const totalRiskScore = projects.reduce(
      (total, project) => total + project.risk.score,
      0,
    );

    const averageRiskScore =
      totalProjects > 0
        ? Number((totalRiskScore / totalProjects).toFixed(2))
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        totalSanctionedAmount,
        totalSpentAmount,
        averageRiskScore,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getDashboardSummary,
};
