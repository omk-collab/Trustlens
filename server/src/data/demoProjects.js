const demoProjects = [
  {
    _id: "demo-water-001",
    name: "Urban Water Pipeline Expansion",
    category: "Water Infrastructure",
    location: "Pune, Maharashtra",
    description:
      "Expansion of water pipeline network for underserved urban areas.",

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
      factors: ["Financial utilization is aligned with progress"],
    },
  },

  {
    _id: "demo-road-002",
    name: "Smart Road Rehabilitation",
    category: "Road Infrastructure",
    location: "Nashik, Maharashtra",
    description:
      "Road rehabilitation project with drainage and pedestrian improvements.",

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
      factors: [
        "Spending is ahead of physical progress",
        "Milestone completion requires verification",
      ],
    },
  },

  {
    _id: "demo-solar-003",
    name: "Community Solar Power Project",
    category: "Renewable Energy",
    location: "Aurangabad, Maharashtra",
    description: "Solar power installation project for community facilities.",

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
      factors: [
        "Financial utilization is high compared with physical progress",
        "Project progress requires verification",
      ],
    },
  },

  {
    _id: "demo-school-004",
    name: "Government School Modernization",
    category: "Education",
    location: "Satara, Maharashtra",
    description:
      "Modernization of classrooms, sanitation facilities and digital learning infrastructure.",

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
    _id: "demo-health-005",
    name: "Rural Health Center Upgrade",
    category: "Healthcare",
    location: "Kolhapur, Maharashtra",
    description:
      "Upgrade of rural healthcare infrastructure and essential medical facilities.",

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

module.exports = demoProjects;
