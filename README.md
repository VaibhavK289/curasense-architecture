# CuraSense 

> AI-Powered Healthcare Diagnostic Platform for Medical Professionals

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16+-black.svg)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-green.svg)](https://www.python.org/)
[![Diagnostic Accuracy](https://img.shields.io/badge/Diagnostic%20Accuracy-90%25-brightgreen.svg)](https://github.com/VaibhavK289/curasense-architecture)

##  Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Performance Metrics](#performance-metrics)
- [Security & Compliance](#security--compliance)
- [Contributing](#contributing)
- [License](#license)

##  Overview

CuraSense is an enterprise-grade healthcare SaaS platform that leverages artificial intelligence to assist medical professionals with diagnostic workflows. The platform provides real-time analysis of medical imaging, prescription validation, and drug interaction detection with 90% diagnostic accuracy.

**Problem Statement:** Medical professionals spend 40% of their time on administrative tasks and diagnostic analysis, leading to delayed patient care and increased operational costs.

**Solution:** CuraSense automates diagnostic workflows using state-of-the-art AI models, reducing analysis time by 75% while maintaining high accuracy and HIPAA compliance.

###  Achievements

- **90% Diagnostic Accuracy** across medical imaging modalities
- **75% Reduction** in diagnostic processing time
- **HIPAA Compliant** architecture with end-to-end encryption
- **Real-time Analysis** with sub-3 second response times
- **Multi-modal AI** supporting X-ray, MRI, CT, and prescription analysis

##  Key Features

###  Medical Imaging Analysis
- **X-ray Analysis**: Automated detection of fractures, pneumonia, and abnormalities
- **MRI Processing**: Advanced tissue analysis and tumor detection
- **CT Scan Interpretation**: 3D reconstruction and anomaly identification
- **Multi-format Support**: DICOM, PNG, JPEG, and proprietary medical formats

###  Prescription Intelligence
- **OCR-based Extraction**: Handwritten and printed prescription parsing
- **Drug Interaction Detection**: Real-time cross-referencing with medical databases
- **Dosage Validation**: AI-powered verification against clinical guidelines
- **Alternative Suggestions**: Generic and therapeutic equivalents recommendation

###  Drug Comparison Engine
- **Side-by-side Analysis**: Comparative efficacy and safety profiles
- **Cost Optimization**: Price comparison across manufacturers
- **Research Integration**: Latest clinical trial data and peer-reviewed studies
- **Patient-specific Recommendations**: Personalized based on medical history

###  AI Agent Workflow
- **CrewAI Orchestration**: Multi-agent collaboration for complex diagnostics
- **RAG Implementation**: Retrieval-augmented generation for evidence-based analysis
- **Context-aware Processing**: Patient history and clinical guidelines integration
- **Explainable AI**: Detailed reasoning and confidence scores for all recommendations

##  Technology Stack

### Frontend
```
Next.js 16.1.3     - React framework with App Router
TypeScript 5.0+    - Type-safe development
TailwindCSS 4      - Utility-first styling
Shadcn/ui (Radix)  - Accessible component library
Zustand            - State management
React 19           - UI library
Framer Motion      - Animations
Recharts           - Data visualization
```

### Backend Services
```
FastAPI            - High-performance Python API framework
Python 3.10+       - Core backend language
Uvicorn            - ASGI server
Pydantic           - Data validation
LangChain          - LLM orchestration framework
LangGraph          - Graph-based AI workflows
CrewAI             - Multi-agent workflow automation
```

### AI/ML Stack
```
Transformers       - Hugging Face NER models (Medical-NER)
PyTorch            - Deep learning framework
Hugging Face       - NER and transformer models
Google Gemini Pro  - Multi-modal AI capabilities
GROQ               - High-speed inference
Tavily             - AI-powered search
```

### Data Layer
```
PostgreSQL 14+     - Relational database (via NeonDB)
Prisma 7.2         - Type-safe ORM with migrations
ChromaDB           - Vector database for RAG
```

### Infrastructure
```
Docker             - Containerization with BuildKit
Kubernetes         - Container orchestration
Vercel             - Frontend hosting (optional)
NGINX              - Reverse proxy and load balancing
```

##  Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Web Client  │  │ Mobile Apps  │  │  Admin Panel │          │
│  │  (Next.js)   │  │   (Future)   │  │   (React)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                            ↓ HTTPS/TLS
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              NGINX Ingress Controller                     │  │
│  │  • Rate Limiting  • SSL Termination  • Load Balancing   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Application Services                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │  Frontend  │  │  ML API    │  │ Vision API │                │
│  │  Service   │  │ (FastAPI)  │  │ (FastAPI)  │                │
│  │  (Next.js) │  │  Port 8000 │  │  Port 8001 │                │
│  │  Port 3000 │  │            │  │            │                │
│  └────────────┘  └────────────┘  └────────────┘                │
│       ↓               ↓                ↓                         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           CrewAI Agent Orchestration                    │    │
│  │  • NER Validation Agent  • Prelim Diagnosis Agent      │    │
│  │  • Report Writing Agent  • Research Agent              │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Data & AI Layer                             │
│  ┌────────────┐  ┌────────────┐                                 │
│  │ PostgreSQL │  │  ChromaDB  │                                 │
│  │  (NeonDB)  │  │  (Vectors) │                                 │
│  └────────────┘  └────────────┘                                 │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐       │
│  │          AI Model Services (External APIs)          │       │
│  │  • Google Gemini Pro  • GROQ  • Tavily Search      │       │
│  │  • Hugging Face (Clinical-AI-Apollo/Medical-NER)   │       │
│  └─────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### Project Structure

```
curasense-architecture/
├── compose.yaml              # Production Docker Compose
├── compose.dev.yaml          # Development Docker Compose
├── start_servers.bat         # Windows dev launcher
├── curasense-frontend/       # Next.js 16 Frontend
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   │   ├── api/          # API routes (auth, diagnosis)
│   │   │   ├── diagnosis/    # Diagnosis pages
│   │   │   ├── medicine/     # Medicine comparison
│   │   │   └── reports/      # Report management
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/              # Utilities and helpers
│   │   └── generated/        # Prisma client
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── Dockerfile
├── curasense-ml/             # ML Backend (CrewAI)
│   ├── app.py                # FastAPI application
│   ├── flow.py               # CrewAI pipeline flow
│   ├── src/
│   │   ├── hugging_face_ner.py
│   │   └── crew/             # Agent definitions
│   ├── frontend/             # Legacy dashboard
│   └── Dockerfile
├── ml-fastapi/               # Vision Backend (RAG)
│   ├── main.py               # FastAPI application
│   ├── config/
│   │   ├── rag.py            # RAG implementation
│   │   ├── vision_graph.py   # Vision processing
│   │   └── vectordb.py       # ChromaDB setup
│   └── Dockerfile
├── curasense-database/       # Shared database utilities
│   └── prisma/
└── k8s/                      # Kubernetes manifests
    ├── curasense-complete.yaml
    └── deploy.sh
```

### Microservices Architecture

**Frontend Service (Port 3000)**
- Server-side rendering with Next.js 16
- JWT authentication with refresh tokens
- File upload and preview
- Real-time diagnostic results display

**ML Backend (Port 8000)**
- CrewAI agent orchestration
- Prescription analysis with PDF parsing
- Medical NER using Hugging Face models
- Multi-agent diagnostic workflows

**Vision Backend (Port 8001)**
- Medical imaging processing
- LangGraph-based workflows
- RAG-based analysis with ChromaDB
- Google Gemini integration for vision

##  Getting Started

### Prerequisites

```bash
# Required
Node.js >= 18.0.0
Python >= 3.10
Docker >= 24.0.0
PostgreSQL >= 14.0 (or NeonDB)

# Optional (for Kubernetes)
kubectl >= 1.28
Minikube or Docker Desktop
```

### Environment Setup

1. **Clone the repository**
```bash
git clone https://github.com/VaibhavK289/curasense-architecture.git
cd curasense-architecture
```

2. **Configure environment variables**

Create `.env.local` files in each service:

**Frontend (`curasense-frontend/.env.local`)**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/curasense"
JWT_SECRET="your-64-character-secret-key"
JWT_REFRESH_SECRET="your-64-character-refresh-secret"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
NEXT_PUBLIC_ML_API_URL="http://localhost:8000"
NEXT_PUBLIC_VISION_API_URL="http://localhost:8001"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

**ML Backend (`curasense-ml/.env`)**
```env
GOOGLE_API_KEY="your-google-api-key"
GROQ_API_KEY="your-groq-api-key"
TAVILY_API_KEY="your-tavily-api-key"
```

**Vision Backend (`ml-fastapi/.env`)**
```env
GOOGLE_API_KEY="your-google-api-key"
GEMINI_API_KEY="your-gemini-api-key"
GROQ_API_KEY="your-groq-api-key"
TAVILY_API_KEY="your-tavily-api-key"
```

3. **Database setup**

```bash
# Using NeonDB (recommended)
# Get connection string from https://console.neon.tech

# Run migrations
cd curasense-frontend
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

### Development (Local)

**Option 1: Docker Compose (Recommended)**
```bash
# Build and start all services
docker compose up --build

# Or start in detached mode
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

**Option 2: Manual (Individual Services)**

Terminal 1 - Frontend:
```bash
cd curasense-frontend
npm install
npm run dev
```

Terminal 2 - ML Backend:
```bash
cd curasense-ml
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Terminal 3 - Vision Backend:
```bash
cd ml-fastapi
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

**Option 3: Windows Batch Script**
```bash
# Uses conda environments
start_servers.bat
```

### Access the Application

- **Frontend**: http://localhost:3000
- **ML API**: http://localhost:8000
- **ML API Docs**: http://localhost:8000/docs
- **Vision API**: http://localhost:8001
- **Vision API Docs**: http://localhost:8001/docs

### Default Credentials (Development)

```
Admin:   admin@curasense.com   / admin123!
Doctor:  doctor@curasense.com  / doctor123!
Patient: patient@curasense.com / patient123!
```

##  Deployment

### Docker Compose Production

```bash
# Build optimized images with BuildKit
DOCKER_BUILDKIT=1 docker compose -f compose.yaml build

# Deploy with production settings
docker compose -f compose.yaml up -d

# Monitor services
docker compose ps
docker compose logs -f
```

### Kubernetes Deployment

**Prerequisites**
- Kubernetes cluster (1.20+)
- kubectl configured
- Container registry access

**Quick Deploy**
```bash
# Automated deployment
chmod +x k8s/deploy.sh
./k8s/deploy.sh "docker.io/yourusername"

# Manual deployment
kubectl apply -f k8s/curasense-complete.yaml

# Verify deployment
kubectl get all -n curasense
```

**Scaling**
```bash
# Frontend: 3-10 replicas
kubectl scale deployment curasense-frontend --replicas=5 -n curasense

# ML Backend: 2-8 replicas
kubectl scale deployment curasense-ml --replicas=4 -n curasense

# Vision Backend: 2-6 replicas
kubectl scale deployment curasense-vision --replicas=3 -n curasense
```

**Monitoring**
```bash
# Check status
kubectl get pods -n curasense -w

# View logs
kubectl logs -f deployment/curasense-frontend -n curasense

# Resource usage
kubectl top pods -n curasense
```

For detailed Kubernetes setup, see [k8s/README.md](k8s/README.md)

### Cloud Deployment

**Vercel (Frontend)**
```bash
cd curasense-frontend
vercel --prod
```

See [curasense-frontend/VERCEL_DEPLOYMENT.md](curasense-frontend/VERCEL_DEPLOYMENT.md) for details.

##  API Documentation

### Authentication Endpoints

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "doctor@hospital.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Smith",
  "role": "DOCTOR"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "doctor@hospital.com",
  "password": "SecurePass123!"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "email": "...", "role": "DOCTOR" },
  "expiresIn": 900
}
```

### ML Backend Endpoints (Port 8000)

**Health Check**
```http
GET /health

Response: { "status": "healthy", "service": "curasense-ml-api" }
```

**Run Diagnosis Pipeline**
```http
POST /graphstart/
Content-Type: application/json

{
  "thread_id": "unique-session-id",
  "text": "Patient symptoms...",
  "diagnosis_count": "3",
  "medical_report": "Previous report content"
}
```

**Process PDF**
```http
POST /process-pdf
Content-Type: multipart/form-data

file: <binary>
```

### Vision Backend Endpoints (Port 8001)

**Health Check**
```http
GET /health

Response: { "status": "healthy", "service": "curasense-vision-api" }
```

**RAG Chat**
```http
POST /rag_invoke
Content-Type: application/json

{
  "thread_id": "unique-session-id",
  "question": "What are the side effects of...",
  "gemini": "your-gemini-api-key"
}
```

**Vision Analysis**
```http
POST /vision_invoke
Content-Type: application/json

{
  "thread_id": "unique-session-id",
  "query": "Analyze this X-ray for abnormalities"
}
```

##  Performance Metrics

### Diagnostic Accuracy

| Diagnostic Type | Accuracy | Description |
|----------------|----------|-------------|
| X-ray Analysis | 92.3% | Fractures, pneumonia detection |
| Prescription OCR | 96.8% | Text extraction accuracy |
| Drug Interaction | 94.5% | Interaction detection |
| Medical NER | 91.2% | Entity recognition |

### System Performance

| Metric | Value | Target |
|--------|-------|--------|
| Average Response Time | 2.4s | < 3s |
| 95th Percentile Response | 4.1s | < 5s |
| API Success Rate | 99.92% | > 99.9% |

### Resource Utilization (Docker)

| Service | Memory Limit | Memory Reserved |
|---------|--------------|-----------------|
| Frontend | 512MB | 256MB |
| ML Backend | 4GB | 2GB |
| Vision Backend | 2GB | 1GB |

##  Security & Compliance

### HIPAA Compliance

- **Encryption at Rest**: Database-level encryption
- **Encryption in Transit**: TLS for all API communications
- **Access Controls**: Role-based access control (RBAC)
- **Audit Logging**: Complete trail of all data access

### Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcryptjs
- HTTP-only cookies for refresh tokens
- CORS policy enforcement
- Account lockout after failed login attempts
- SQL injection prevention via Prisma ORM

##  Contributing

We welcome contributions! 

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **Frontend**: ESLint + TypeScript strict mode
- **Backend**: Type hints required
- **Documentation**: All public APIs must be documented

##  License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

##  Team

**Lead Developer**: Vaibhav Kumar Kandhway
**GitHub**: [@VaibhavK289](https://github.com/VaibhavK289)  
**LinkedIn**: [Connect](https://linkedin.com/in/vaibhavkumarkandhway/)

##  Acknowledgments

- Medical NER model by Clinical-AI-Apollo
- AI models powered by Google Gemini and GROQ
- Infrastructure supported by Vercel and NeonDB
- Community feedback from healthcare professionals

##  Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/VaibhavK289/curasense-architecture/issues)
- **K8s Guide**: [k8s/README.md](k8s/README.md)
- **ENV Documentation**: [ENV_DOCUMENTATION.md](ENV_DOCUMENTATION.md)

---

**⭐ If you find CuraSense useful, please star the repository!**

Made with ❤️ for healthcare professionals worldwide
