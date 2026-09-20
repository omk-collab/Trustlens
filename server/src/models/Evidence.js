const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    type: {
      type: String,
      enum: ["PHOTO", "DOCUMENT", "VIDEO", "REPORT"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    url: {
      type: String,
      default: "",
      trim: true,
    },

    capturedDate: {
      type: Date,
      default: null,
    },
    location: {
      latitude: {
        type: Number,
        min: -90,
        max: 90,
        default: null,
      },

      longitude: {
        type: Number,
        min: -180,
        max: 180,
        default: null,
      },
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verificationNote: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Evidence", evidenceSchema);
