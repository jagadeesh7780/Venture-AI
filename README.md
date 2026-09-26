# VENTURE AI — Autonomous Enterprise Planning & Execution Engine

[![Live Demo](https://img.shields.io/badge/Live_Demo-venture--ai--beta.vercel.app-00F2DE?style=for-the-badge&logo=vercel&logoColor=black)](https://venture-ai-beta.vercel.app/)
![Platform](https://img.shields.io/badge/Platform-Larana%20%7C%20VENTURE%20AI-0D4C92?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css)

> 🚀 **Hosted Live Application:** [https://venture-ai-beta.vercel.app/](https://venture-ai-beta.vercel.app/)

VENTURE AI is an autonomous business feasibility modeling and execution engine. It models, simulates, and optimizes commercial ventures using Google Maps GIS geocoding, RAG regulatory intelligence, deterministic Python financial algorithms (INR ₹), and 2D/3D spatial operations blueprints.

---

## 🌟 Key Capabilities

1. **Autonomous Multi-Agent Pipeline (9 Specialized Nodes)**:
   - Business Concept & Taxonomy Extractor
   - GIS Spatial Geocoding & Foot-Traffic Telemetry
   - Direct & Indirect Competitor Density Index
   - MSME Project Profiles & NSIC Machinery Catalog Matcher
   - Deterministic 12-Month Financial Engine (Revenue, Expenses, CapEx, Payback Horizon)
   - Wholesale Vendor & Sourcing Networks
   - Omnichannel Marketing & B2B Distribution Split
   - RAG Statutory Licensing & Government Scheme Compliance (Udyam, GST, FSSAI)
   - Composite ML Feasibility & Viability Scorer

2. **Full-Featured Landing Page & Operations Portal**:
   - Modern, high-contrast Orange & White design aesthetics.
   - Interactive Solutions, About Us, Pricing (Monthly/Yearly with INR pricing), and Inquiry Contact Desk.
   - Dynamic user authentication and JWT session management.

3. **Operations Blueprint & Spatial Terminal**:
   - Facility floor schematics, machinery manifests, and catchment ecosystem analysis.

---

## 🏗️ Project Architecture

```
aibusiness/
├── backend/
│   ├── app/
│   │   ├── agents/          # Specialized LangGraph AI Agents
│   │   ├── core/            # Configuration & Security (JWT, CORS)
│   │   ├── db/              # SQLAlchemy Database Sessions & Models
│   │   ├── ml/              # Scikit-Learn Feasibility Predictor
│   │   ├── rag/             # ChromaDB Vector Store & Knowledge Chunks
│   │   ├── routes/          # API Routers (Auth, Business, Intelligence)
│   │   └── services/        # Orchestrator & Analysis Services
│   ├── dataset/             # MSME & NSIC Curated Project Profiles
│   ├── Procfile             # Process configuration for Render / Heroku
│   ├── requirements.txt     # Python backend dependencies
│   └── run.py               # Local server launch script
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components & Form Steppers
│   │   ├── context/         # AuthContext & Session Management
│   │   ├── data/            # Instant 0ms MSME Catalog
│   │   ├── layouts/         # Dashboard & Auth Layouts
│   │   ├── pages/           # LandingPage, Dashboard, Analysis, Digital Twin
│   │   └── services/        # Axios API Client
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── render.yaml              # Render Deployment Blueprint
└── DEPLOY_RENDER.md         # Step-by-step Render Deployment Guide
```

---

## ⚡ Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python run.py
```
Backend runs at `http://localhost:8000` (API Docs at `http://localhost:8000/docs`).

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## ☁️ Deployment

- **Backend**: Ready for one-click deployment on [Render](https://render.com) using [`render.yaml`](./render.yaml). See [`DEPLOY_RENDER.md`](./DEPLOY_RENDER.md) for full instructions.
- **Frontend**: Optimized for [Vercel](https://vercel.com) or Render Static Sites.

---

## 📄 License
MIT License. Developed for enterprise business planning and autonomous operations.
