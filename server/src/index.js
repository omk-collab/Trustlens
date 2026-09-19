const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const projectRoutes = require("./routes/projectRoutes");

const transactionRoutes = require("./routes/transactionRoutes");

const milestoneRoutes = require("./routes/milestoneRoutes");

const riskRoutes = require("./routes/riskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/projects", projectRoutes);

app.use("/api/transactions", transactionRoutes);

app.use("/api/milestones", milestoneRoutes);

app.use("/api/risk", riskRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "TrustLens API is running 🚀",
  });
});

const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });
