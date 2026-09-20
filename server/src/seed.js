const mongoose = require("mongoose");
require("dotenv").config();

const Project = require("./models/Project");

const projects = [
  {
    name: "Urban Water Pipeline Expansion",
    category: "Water Infrastructure",
    location: "Pune, Maharashtra",
    description:
      "Synthetic demo project for expanding the urban water pipeline network.",

    financial: {
      sanctionedAmount: 10000000,
      releasedAmount: 8000000,
      spentAmount: 6000000,
    },

    execution: {
      implementingAgency: "Public Works Department",
      vendor: "Aqua Infrastructure Pvt Ltd",
      contractAmount: 8000000,
    },

    progress: {
      physicalProgress: 85,
      status: "In Progress",
    },

    risk: {
      score: 18,
      level: "LOW",
      factors: ["Financial utilization aligned with project progress"],
    },
  },

  {
    name: "Smart Road Rehabilitation",
    category: "Road Infrastructure",
    location: "Nashik, Maharashtra",
    description:
      "Synthetic demo project for road rehabilitation and drainage improvement.",

    financial: {
      sanctionedAmount: 15000000,
      releasedAmount: 12000000,
      spentAmount: 10500000,
    },

    execution: {
      implementingAgency: "Municipal Corporation",
      vendor: "Maharashtra Infra Works",
      contractAmount: 11800000,
    },

    progress: {
      physicalProgress: 62,
      status: "In Progress",
    },

    risk: {
      score: 47,
      level: "MEDIUM",
      factors: ["Spending is ahead of physical progress"],
    },
  },

  {
    name: "Community Solar Power Project",
    category: "Renewable Energy",
    location: "Aurangabad, Maharashtra",
    description:
      "Synthetic demo project for installing solar infrastructure at community facilities.",

    financial: {
      sanctionedAmount: 8500000,
      releasedAmount: 7000000,
      spentAmount: 6800000,
    },

    execution: {
      implementingAgency: "District Energy Department",
      vendor: "SunGrid Energy Solutions",
      contractAmount: 6900000,
    },

    progress: {
      physicalProgress: 38,
      status: "In Progress",
    },

    risk: {
      score: 72,
      level: "HIGH",
      factors: ["High financial utilization compared with physical progress"],
    },
  },

  {
    name: "Government School Modernization",
    category: "Education",
    location: "Satara, Maharashtra",
    description:
      "Synthetic demo project for classroom and digital learning infrastructure modernization.",

    financial: {
      sanctionedAmount: 6500000,
      releasedAmount: 5000000,
      spentAmount: 3200000,
    },

    execution: {
      implementingAgency: "District Education Office",
      vendor: "EduBuild Contractors",
      contractAmount: 4800000,
    },

    progress: {
      physicalProgress: 48,
      status: "In Progress",
    },

    risk: {
      score: 35,
      level: "MEDIUM",
      factors: ["Milestone verification pending"],
    },
  },

  {
    name: "Rural Health Center Upgrade",
    category: "Healthcare",
    location: "Kolhapur, Maharashtra",
    description:
      "Synthetic demo project for upgrading rural healthcare infrastructure.",

    financial: {
      sanctionedAmount: 12000000,
      releasedAmount: 12000000,
      spentAmount: 12000000,
    },

    execution: {
      implementingAgency: "District Health Department",
      vendor: "CareBuild Infrastructure",
      contractAmount: 11500000,
    },

    progress: {
      physicalProgress: 100,
      status: "Completed",
    },

    risk: {
      score: 8,
      level: "LOW",
      factors: ["Project completed", "Financial records reconciled"],
    },
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Atlas connected ✅");

    await Project.deleteMany({});

    const insertedProjects = await Project.insertMany(projects);

    console.log(
      `${insertedProjects.length} demo projects inserted successfully 🚀`,
    );

    await mongoose.disconnect();

    console.log("Database connection closed.");
  } catch (error) {
    console.error("Seed failed ❌");
    console.error(error.message);
    process.exit(1);
  }
}

seedDatabase();
