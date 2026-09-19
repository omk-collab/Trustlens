const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    financial: {
      sanctionedAmount: {
        type: Number,
        required: true,
        min: 0,
      },

      releasedAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      spentAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    execution: {
      implementingAgency: {
        type: String,
        default: "",
      },

      vendor: {
        type: String,
        default: "",
      },

      contractAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    progress: {
      physicalProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      status: {
        type: String,
        enum: ["Not Started", "In Progress", "Completed"],
        default: "Not Started",
      },
    },

    verification: {
      lastVerificationDate: {
        type: Date,
        default: null,
      },
    },

    risk: {
      score: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      level: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
        default: "LOW",
      },

      factors: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Project", projectSchema);
