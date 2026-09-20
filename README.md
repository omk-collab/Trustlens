# 🔍 TrustLens

## Public Project & Fund Transparency Platform

> **Follow the Money. Verify the Progress. Build Public Trust.**

TrustLens is a web-based public project transparency platform that brings **project information, fund utilization, transactions, physical progress, evidence, and risk indicators** into one unified dashboard.

The goal is to make public project information easier to understand, monitor, and verify.

---

## 🚨 Problem Statement

Public infrastructure projects involve significant amounts of public money, but information related to these projects is often scattered across different sources.

This creates several challenges:

- Difficulty tracking how allocated funds are being utilized
- Lack of centralized project information
- Difficulty comparing financial spending with physical progress
- Delayed project milestones may not be easily visible
- Project evidence is difficult to access and organize
- Citizens and stakeholders may struggle to identify projects that require further verification

There is a need for a platform that connects **money, progress, and evidence** in one place.

---

# 💡 Our Solution

### TrustLens

TrustLens provides a centralized platform for monitoring public projects and identifying transparency-related risk signals.

The platform connects:

```text
Project
   ↓
Budget
   ↓
Fund Flow
   ↓
Transactions
   ↓
Progress
   ↓
Evidence
   ↓
Risk Analysis

Instead of looking at individual pieces of information separately, TrustLens provides a unified view of the complete project lifecycle.

✨ Key Features
📊 1. Project Monitoring Dashboard

Users can explore projects through a centralized dashboard containing:

Project name
Category
Location
Budget information
Spending information
Physical progress
Project status
Risk level
💰 2. Fund Flow & Financial Tracking

TrustLens provides visibility into project finances.

Users can monitor:

Sanctioned amount
Released amount
Spent amount
Project transactions
Total transaction value
Financial reconciliation

This helps identify differences between recorded project spending and transaction data.

📈 3. Progress & Milestone Monitoring

Projects can be monitored through milestones and physical progress.

The platform provides:

Physical progress percentage
Project milestones
Milestone status
Timeline information
Delayed milestone detection
Progress visualization
📷 4. Evidence Management

TrustLens allows project-related evidence to be uploaded and associated with projects.

Evidence can contain:

Images
Project reference
Location information
Timestamp
Verification status

Evidence is stored using cloud-based storage through Cloudinary.

🗺️ 5. Interactive Project Map

Projects can be explored geographically through an interactive map.

The map helps users:

Locate projects
Explore projects by location
Visualize project risk levels
Understand the geographical distribution of projects
⚠️ 6. Risk Analysis Engine

TrustLens generates an explainable risk score using multiple project signals.

The current risk engine considers factors such as:

Financial Risk
Financial mismatch
Difference between project spending and transactions
Timeline Risk
Delayed milestones
Timeline deviations
Evidence Risk
Missing evidence
Evidence verification gaps
📊 Risk Levels
Score	Risk Level
0 – 30	🟢 LOW
31 – 60	🟡 MEDIUM
61 – 80	🟠 HIGH
81 – 100	🔴 CRITICAL

Important: The TrustLens risk score is an indicator for further verification. It is not proof of fraud, corruption, or wrongdoing.

🧠 How TrustLens Works
                PROJECT DATA
                     │
                     ▼
              FINANCIAL DATA
                     │
                     ▼
               TRANSACTIONS
                     │
                     ▼
           MILESTONES & PROGRESS
                     │
                     ▼
                 EVIDENCE
                     │
                     ▼
            RISK ANALYSIS ENGINE
                     │
                     ▼
          TRANSPARENCY DASHBOARD
🏗️ System Architecture
                    TRUSTLENS
                        │
                        ▼
                React Frontend
                        │
                        │ REST API
                        ▼
               Node.js + Express
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
         MongoDB Atlas         Cloudinary
              │                   │
              ▼                   ▼
       Project & Financial     Evidence
            Data              Storage
              │
              ▼
       Risk Analysis Engine
              │
              ▼
       Transparency Dashboard
🛠️ Technology Stack
Frontend
React.js
Vite
Tailwind CSS
Recharts
Leaflet
Lucide React
Backend
Node.js
Express.js
Mongoose
Database
MongoDB
MongoDB Atlas
Cloud & Deployment
Cloudinary
Vercel
Render
📂 Project Structure
TrustLens/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── package.json
│   └── .env
│
└── README.md
🔌 API Modules

TrustLens backend provides REST APIs for different parts of the platform.

Projects
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
Transactions
GET /api/transactions/project/:projectId
GET /api/transactions/reconcile/:projectId
Milestones
GET /api/milestones/project/:projectId
GET /api/milestones/timeline/:projectId
Evidence
GET  /api/evidence/project/:projectId
POST /api/evidence
Risk Analysis
GET /api/risk/financial/:projectId
🔐 Security & Data Handling

TrustLens follows a separated frontend-backend architecture.

Key practices include:

REST API based communication
Environment variables for sensitive credentials
MongoDB Atlas for database storage
Cloudinary for evidence storage
Backend APIs separated from frontend
CORS configuration
Server-side data processing
🌐 Live Demo
Frontend

https://trustlens-alpha-sooty.vercel.app

Backend API

https://trustlens-5ycc.onrender.com

GitHub Repository

https://github.com/omk-collab/Trustlens

🚀 Getting Started
1. Clone the Repository
git clone https://github.com/omk-collab/Trustlens.git
cd Trustlens
2. Setup Frontend
cd client
npm install
npm run dev

Frontend will run on:

http://localhost:5173
3. Setup Backend

Open another terminal:

cd server
npm install
npm run dev

Backend will run on:

http://localhost:8000
🔑 Environment Variables

Create a .env file inside the server folder.

Example:

PORT=8000

MONGO_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

For frontend deployment:

VITE_API_URL=your_backend_url

Never commit real credentials or secrets to GitHub.

🎯 Use Cases

TrustLens can be used by:

👥 Citizens

To understand the status and utilization of public projects.

🏛️ Authorities

To monitor projects and identify areas requiring verification.

🔎 Auditors

To compare financial information, project progress, and supporting evidence.

📰 Researchers & Journalists

To explore project-level transparency information.

🌐 Public Transparency Platforms

As a foundation for building more accessible public project monitoring systems.

📌 Example Workflow

Consider a public infrastructure project.

The project contains:

Sanctioned Amount
        ↓
Released Amount
        ↓
Contract / Vendor
        ↓
Transactions
        ↓
Physical Progress
        ↓
Milestones
        ↓
Evidence
        ↓
Risk Analysis

TrustLens brings these components together so that users can understand the project from both financial and physical perspectives.

🧪 Demo Data

The current hackathon prototype uses demonstration/synthetic project data to showcase the complete workflow.

The platform architecture is designed so that verified real-world datasets can be integrated in the future.

🚧 Current Limitations

The current prototype focuses on demonstrating the transparency workflow.

Future versions can improve:

Data source verification
Automated data collection
Historical anomaly detection
Advanced AI models
Large-scale government dataset integration
Automated evidence verification
🔮 Future Scope
🤖 AI-Powered Anomaly Detection

Use historical project data to identify unusual financial and progress patterns.

🛰️ Satellite-Based Progress Verification

Use satellite or remote-sensing data to compare reported project progress with physical observations.

📄 Automated Document Verification

Extract and verify information from project documents, contracts, invoices, and reports.

🔗 Immutable Fund Trail

Explore blockchain-based approaches for creating tamper-resistant transaction histories.

🗣️ Public Feedback

Allow citizens to submit observations, complaints, and additional evidence.

📊 Advanced Analytics

Provide large-scale analytics across:

Regions
Departments
Project categories
Contractors
Financial utilization
Completion timelines
🌟 Vision

TrustLens aims to make public project information:

Transparent • Understandable • Traceable • Verifiable

Our vision is to build a system where people can follow the journey of public funds from allocation to execution and understand whether financial spending aligns with actual project progress.

🏆 Hackathon Prototype

Built as a rapid prototype for Hack Devengers 2.0.

The project focuses on demonstrating a practical approach to public project transparency using modern web technologies, interactive visualization, evidence management, and explainable risk analysis.

❤️ TrustLens
Follow the Money.
Verify the Progress.
Build Public Trust.