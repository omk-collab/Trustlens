const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const projectRoutes = require("./routes/projectRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const milestoneRoutes = require("./routes/milestoneRoutes");
const riskRoutes = require("./routes/riskRoutes");
const evidenceRoutes = require("./routes/evidenceRoutes");
const cloudinary = require("./config/cloudinary");

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/projects", projectRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/evidence", evidenceRoutes);

// Static uploads folder
app.use("/uploads", express.static("uploads"));

// Cloudinary connection test
app.get("/api/cloudinary-test", async (req, res) => {
  try {
    const result = await cloudinary.api.ping();

    res.json({
      success: true,
      message: "Cloudinary connection working",
      data: result,
    });
  } catch (error) {
    console.error("Cloudinary test failed ❌", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Cloudinary configuration test
app.get("/api/cloudinary-config-test", async (req, res) => {
  try {
    const config = cloudinary.config();

    res.json({
      success: true,
      cloud_name: config.cloud_name,
      api_key_present: !!config.api_key,
      api_secret_present: !!config.api_secret,
    });
  } catch (error) {
    console.error("Cloudinary config test failed ❌", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "TrustLens API is running 🚀",
  });
});

const PORT = process.env.PORT || 8000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");
    console.log("Database:", mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });
