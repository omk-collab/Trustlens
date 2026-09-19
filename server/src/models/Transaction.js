const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    transactionType: {
      type: String,
      enum: ["RELEASE", "PAYMENT", "REFUND", "ADJUSTMENT"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    from: {
      type: String,
      required: true,
      trim: true,
    },

    to: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    transactionDate: {
      type: Date,
      required: true,
    },

    referenceNumber: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Transaction", transactionSchema);
