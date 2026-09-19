const Milestone = require("../models/Milestone");

const analyzeProjectTimeline = async (projectId) => {
  const milestones = await Milestone.find({ projectId });

  const today = new Date();

  const delayedMilestones = milestones.filter((milestone) => {
    const targetDate = new Date(milestone.targetDate);

    return targetDate < today && milestone.progress < 100;
  });

  return {
    projectId,
    totalMilestones: milestones.length,
    delayedMilestones: delayedMilestones.length,
    timelineRisk: delayedMilestones.length > 0 ? "DELAY_DETECTED" : "ON_TRACK",
    delayedMilestoneDetails: delayedMilestones.map((milestone) => ({
      id: milestone._id,
      title: milestone.title,
      targetDate: milestone.targetDate,
      progress: milestone.progress,
      status: milestone.status,
    })),
  };
};

module.exports = {
  analyzeProjectTimeline,
};
