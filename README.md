# 🏥 CuraSense - AI-Powered Medical Diagnosis System

![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)
![React](https://img.shields.io/badge/React-19.2-61DAFB.svg)
![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

An advanced AI-powered medical diagnosis system leveraging multi-agent workflows, RAG, and vision analysis for comprehensive clinical decision support. Features a modern **Next.js 16** frontend with beautiful animations and a professional healthcare UI.

---

## 🚀 What's New

- 🎨 **Brand New Next.js 16 Frontend** - Complete redesign with React 19 and TypeScript
- 🌊 **Framer Motion Animations** - Smooth, professional animations throughout
- 🎯 **Modern UI/UX** - Radix UI components with Tailwind CSS 4
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🌙 **Dark/Light Mode** - Theme switching with next-themes
- 📊 **Report History** - Track and manage all your past diagnoses
- 💬 **AI Chat Assistant** - Interactive chat for follow-up questions
- 🔄 **State Management** - Zustand for efficient client-state management

---

## ✨ Core Features

- **🤖 Multi-Agent AI Workflows** - Orchestrated diagnosis using CrewAI and LangGraph
- **📄 Prescription Analysis** - Upload and analyze medical prescriptions and blood test reports
- **👁️ X-Ray & CT Analysis** - Vision AI for analyzing X-rays, CT scans, and MRI images using Gemini 2.5 Flash & Llama 4 Scout.
- **💊 Medicine Comparison** - Compare medications, check interactions, find alternatives using Tavily Search API.
- **🔍 RAG System** - Semantic search with ChromaDB vector database and Google Embeddings.
- **⚡ Real-time Streaming** - Live diagnosis updates with Server-Sent Events.
- **🔐 Secure Authentication** - JWT-based sessions, role-based access control, and HIPAA-compliant Audit Logging.
- **📊 Comprehensive Analytics** - Dedicated dashboard for usage statistics, processing time, and confidence monitoring.

---

## 🏗️ Architecture & Technology Stack

CuraSense employs an enterprise-grade, highly scalable microservices architecture. It utilizes a powerful **dual-backend** system separating ML Inference logic from Computer Vision & RAG Logic.

### 1. Frontend Web Client (`curasense-frontend`)
- **Framework**: Next.js 16 (App Router), React 19
- **Styling & UI**: Tailwind CSS 4, Radix UI Primitives, Framer Motion
- **State**: Zustand (global), React Context (auth)
- **Hosting**: Prepared for Vercel/AWS CloudFront.

### 2. Primary Database & Data Layer (`curasense-database`)
- **Database**: PostgreSQL (Serverless via NeonDB)
- **ORM Tool**: Prisma 7+ using a robust Connection Pooling pattern.
- **Security**: Bcrypt password hashing, Soft deletions, and explicit Audit Logging.

### 3. ML API Service (`curasense-ml`)
- **Framework**: FastAPI (Python) | Runs on Port 8000
- **Purpose**: Text-based and PDF-based medical report diagnoses.
- **AI Stack**: CrewAI pipelines, HuggingFace Medical NER models, Groq OSS LLMs.

### 4. Vision & RAG API Service (`ml-fastapi`)
- **Framework**: FastAPI (Python) | Runs on Port 8001
- **Purpose**: X-ray analyses, MRI scans, and Retrieval-Augmented Generation.
- **AI Stack**: LangGraph multi-model consensus graphs, ChromaDB Vector database, Gemini embeddings.

---

## 🗂️ Project Structure

```text
curasense_diagnosis_ml_model/
├── curasense-frontend/      # Refactored Next.js 16 Web Application
├── curasense-ml/            # FastAPI Text Diagnosis & CrewAI Service
├── ml-fastapi/              # FastAPI Vision & LangGraph Service
├── curasense-database/      # Prisma Schema, Migrations, Seed & Utilities
├── k8s/                     # Kubernetes Deployment Manifests
├── docs/                    # Architecture diagrams and deep-dive documentation
├── compose.yaml             # Docker Compose for local multi-container setup
├── start_servers.bat        # Windows batch script for quick local development
└── README.md                # Project README file
```

---

## ⚙️ Getting Started

### Prerequisites

- **Tools**: [Docker Desktop](https://www.docker.com/), [Node.js 18+](https://nodejs.org/), [Python 3.10+](https://www.python.org/)
- **API Keys Needed**: 
  - [Google Gemini API](https://ai.google.dev/)
  - [Groq API](https://console.groq.com/)
  - [Tavily API](https://tavily.com/)
- **Database**: Active [NeonDB](https://neon.tech/) PostgreSQL connection.

### 1. Environment Variables Configuration

Create `.env` and `.env.local` files in their respective folders.

**Frontend (`curasense-frontend/.env.local`)**:
```env
NEXT_PUBLIC_FRONTEND_API=http://localhost:8000
NEXT_PUBLIC_ML_API=http://localhost:8001
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
JWT_SECRET=super_secret_jwt_key
JWT_REFRESH_SECRET=super_secret_refresh_key
```

**ML API (`curasense-ml/.env`)**:
```env
GROQ_API_KEY=your_groq_key
TAVILY_API_KEY=your_tavily_key
HOST=0.0.0.0
PORT=8000
```

**Vision API (`ml-fastapi/.env`)**:
```env
GOOGLE_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
TAVILY_API_KEY=your_tavily_key
HOST=0.0.0.0
PORT=8001
```

### 2. Running Locally (Quickstart via Docker)

The easiest way to orchestrate all services is via Docker Compose:

```bash
# Build and run all microservices and frontend
docker-compose up --build
```
- **Web App**: http://localhost:3000
- **ML API**: http://localhost:8000
- **Vision API**: http://localhost:8001

### 3. Running Locally (Native/Windows)

If you prefer to run the system directly on your OS using Conda and NPM:

**Start the Backends (Windows Batch Script):**
```cmd
# Automatically spins up both FastAPI backends on ports 8000 & 8001
.\start_servers.bat
```

**Start the Frontend Web Application:**
```bash
cd curasense-frontend
npm install
npm run dev
```

---

## 📚 Deep-Dive Documentation Resource

To understand how each piece of the architecture works at a granular level, please check out our detailed technical documentation:
- 🎨 **[Frontend Documentation](FRONTEND_DOCUMENTATION.md)** - Next.js setups, Zustand Store configurations, UI theming, Component specifics.
- ⚙️ **[Backend Documentation](BACKEND_DOCUMENTATION.md)** - Dual APIs, CrewAI flow charts, LangGraph orchestration details.
- 🗄️ **[Database Documentation](DATABASE_DOCUMENTATION.md)** - ER Diagrams, Data Models, JWT flow, and Prisma initialization guides.
- 🗺️ **[Project Roadmap](PROJECT_ROADMAP.md)** - AWS Cloud scaling plans.

---

## 🛠️ Roadmap & Future Vision

The CuraSense team is heavily focused on migrating away from standard single-instance setups to enterprise-grade cloud capabilities. The immediate priority is the **AWS Infrastructure Migration**. 

### Upcoming Cloud Milestones
- ☁️ **ECS Fargate**: Enabling zero-downtime, serverless container auto-scaling.
- 🗄️ **RDS PostgreSQL (Multi-AZ)**: Upgrading the NeonDB setup for enhanced regional resiliency.
- 🛡️ **AWS KMS & WAF**: Integrating native encryption and firewall management aimed at full **HIPAA Compliance**.
- 🩺 **Telemedicine Support**: Exploring direct clinician interfaces for live 1-on-1 virtual consultations and WebRTC integrations.

---

## 🤝 Contributing

Healthcare is universal, and so is our community. Contributions, issues, and feature requests are welcome!

1. Fork the Repository
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
<b>Building the AI-Powered Clinical Support System of Tomorrow</b><br>
<i>Prepared by the CuraSense Development Team</i>
</div>
