const express = require("express");

const {
  createMilestone,
  getProjectMilestones,
  updateMilestone,
  analyzeTimeline,
} = require("../controllers/milestoneController");

const router = express.Router();

router.post("/", createMilestone);

router.get("/project/:projectId", getProjectMilestones);

router.get("/timeline/:projectId", analyzeTimeline);

router.put("/:id", updateMilestone);

module.exports = router;
