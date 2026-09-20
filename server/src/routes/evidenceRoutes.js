const express = require("express");

const {
  createEvidence,
  getProjectEvidence,
  verifyEvidence,
  deleteEvidence,
} = require("../controllers/evidenceController");

const upload = require("../middleware/upload");

const router = express.Router();

// Upload evidence image
router.post("/", upload.single("evidence"), createEvidence);

// Get all evidence for a project
router.get("/project/:projectId", getProjectEvidence);

// Verify evidence
router.put("/verify/:id", verifyEvidence);

// Delete evidence
router.delete("/:id", deleteEvidence);

module.exports = router;
