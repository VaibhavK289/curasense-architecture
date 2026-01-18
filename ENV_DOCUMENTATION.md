# CuraSense Environment Variables Documentation

## Overview

This document describes all environment variables used across the CuraSense project and their locations in each service's `.env` file.

---

## 1. Frontend Service (`curasense-frontend`)

### Files
- `.env` - Production environment
- `.env.development` - Local development
- `.env.production` - Production deployment
- `.env.local` - Local overrides (git-ignored)

### Environment Variables

#### Database Configuration
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `DATABASE_URL` | String | ✅ Yes | Neon DB pooled connection string |
| | | | Format: `postgresql://user:pass@ep-xxx-pooler.region.neon.tech/db?sslmode=require` |

**Usage**: [curasense-frontend/src/lib/prisma.ts](curasense-frontend/src/lib/prisma.ts#L19)

#### Authentication
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `JWT_SECRET` | String (64+ chars) | ✅ Yes | JWT signing secret for access tokens |
| `JWT_REFRESH_SECRET` | String (64+ chars) | ✅ Yes | JWT signing secret for refresh tokens |
| `ACCESS_TOKEN_EXPIRES_IN` | String | ❌ No | Access token TTL (default: `15m`) |
| `REFRESH_TOKEN_EXPIRES_IN` | String | ❌ No | Refresh token TTL (default: `7d`) |

**Usage**: [curasense-frontend/src/lib/db/auth.ts](curasense-frontend/src/lib/db/auth.ts#L11)

#### External Services
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_ML_API_URL` | URL | ✅ Yes | ML backend endpoint (public) |
| `NEXT_PUBLIC_VISION_API_URL` | URL | ✅ Yes | Vision/X-ray backend endpoint (public) |

**Usage**: 
- [curasense-frontend/src/app/api/diagnose/pdf/route.ts](curasense-frontend/src/app/api/diagnose/pdf/route.ts#L4)
- [curasense-frontend/src/app/api/diagnose/text/route.ts](curasense-frontend/src/app/api/diagnose/text/route.ts#L4)

#### Next.js Settings
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXTAUTH_URL` | URL | ✅ Yes | Application URL for auth callbacks |
| `NODE_ENV` | String | ✅ Yes | Environment mode: `development` or `production` |
| `NEXT_TELEMETRY_DISABLED` | String | ❌ No | Disable Next.js telemetry (set to `1`) |

### Example `.env.development`
```dotenv
DATABASE_URL="postgresql://neondb_owner:npg_UpXcmf2Jhag8@ep-soft-king-aeqdcslr-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="dev-secret-key-minimum-32-characters-for-dev-only"
JWT_REFRESH_SECRET="dev-refresh-secret-key-minimum-32-chars-for-dev-only"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
NEXT_PUBLIC_ML_API_URL="http://localhost:8000"
NEXT_PUBLIC_VISION_API_URL="http://localhost:8001"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
NEXT_TELEMETRY_DISABLED=1
```

---

## 2. Database Service (`curasense-database`)

### Files
- `.env` - Production environment
- `.env.example` - Template

### Environment Variables

#### Database Connection
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `DATABASE_URL` | String | ✅ Yes | Neon DB pooled connection string (for queries) |
| `DATABASE_URL_DIRECT` | String | ❌ No | Neon DB direct connection (for migrations) |

**Usage**: [curasense-database/prisma/seed.ts](curasense-database/prisma/seed.ts), [curasense-database/prisma/test-connection.ts](curasense-database/prisma/test-connection.ts)

#### Authentication (shared)
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `JWT_SECRET` | String (64+ chars) | ✅ Yes | Must match frontend JWT_SECRET |
| `JWT_REFRESH_SECRET` | String (64+ chars) | ✅ Yes | Must match frontend JWT_REFRESH_SECRET |

#### Prisma Settings
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NODE_ENV` | String | ✅ Yes | Environment: `production` or `development` |
| `PRISMA_DEBUG` | String | ❌ No | Enable debug logging (set to `true`) |

### Example `.env`
```dotenv
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.region.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-production-jwt-secret-64-characters-minimum"
JWT_REFRESH_SECRET="your-production-refresh-secret-64-characters-minimum"
NODE_ENV="production"
PRISMA_DEBUG=false
```

---

## 3. ML Backend (`curasense-ml`)

### Files
- `.env` - Production environment
- `.env.example` - Template

### Environment Variables

#### API Keys (External Services)
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `GOOGLE_API_KEY` | String | ✅ Yes | Google API key for basic services |
| `GROQ_API_KEY` | String | ✅ Yes | Groq API key for LLM inference |
| `TAVILY_API_KEY` | String | ✅ Yes | Tavily API key for medical research |
| `OPENAI_API_KEY` | String | ❌ No | OpenAI key (optional, for embeddings) |

**Usage**: Internal ML pipeline, text diagnosis, research agents

#### CrewAI Configuration
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `CREWAI_TRACING_ENABLED` | String | ❌ No | Enable CrewAI tracing (set to `true` for debugging) |

#### Server Configuration
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `HOST` | String | ✅ Yes | Bind address (default: `0.0.0.0`) |
| `PORT` | Number | ✅ Yes | Server port (default: `8000`) |

#### Logging
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `LOG_LEVEL` | String | ❌ No | Logging level: `DEBUG`, `INFO`, `WARNING`, `ERROR` |

#### CORS & Security
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `ALLOWED_ORIGINS` | CSV | ❌ No | Comma-separated list of allowed CORS origins |

### Example `.env`
```dotenv
GOOGLE_API_KEY="your-google-api-key"
GROQ_API_KEY="your-groq-api-key"
TAVILY_API_KEY="your-tavily-api-key"
OPENAI_API_KEY="your-openai-api-key"
CREWAI_TRACING_ENABLED=true
HOST="0.0.0.0"
PORT=8000
LOG_LEVEL="INFO"
ALLOWED_ORIGINS="http://localhost:3000,https://curasense.yourdomain.com,https://curasense-frontend.vercel.app"
```

---

## 4. FastAPI Backend (`ml-fastapi`)

### Files
- `.env` - Production environment
- `.env.example` - Template

### Environment Variables

#### API Keys (External Services)
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `GOOGLE_API_KEY` | String | ✅ Yes | Google API key for vision/multimodal |
| `GROQ_API_KEY` | String | ✅ Yes | Groq API key for LLM inference |
| `TAVILY_API_KEY` | String | ✅ Yes | Tavily API key for research |
| `OPENAI_API_KEY` | String | ❌ No | OpenAI key (optional) |
| `HF_TOKEN` | String | ❌ No | HuggingFace token for model access |

**Usage**: FastAPI vision processing, medical image analysis

#### Google Cloud Integration
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `GOOGLE_CREDENTIALS_BASE64` | String | ❌ No | Base64-encoded Google service account JSON |

#### Server Configuration
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `HOST` | String | ✅ Yes | Bind address (default: `0.0.0.0`) |
| `PORT` | Number | ✅ Yes | Server port (default: `8080`) |

#### Logging & CORS
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `LOG_LEVEL` | String | ❌ No | Logging level (default: `INFO`) |
| `ALLOWED_ORIGINS` | CSV | ❌ No | Comma-separated list of allowed CORS origins |

### Example `.env`
```dotenv
GOOGLE_API_KEY="your-google-api-key"
GROQ_API_KEY="your-groq-api-key"
TAVILY_API_KEY="your-tavily-api-key"
OPENAI_API_KEY="your-openai-api-key"
HF_TOKEN="your-huggingface-token"
HOST="0.0.0.0"
PORT=8080
LOG_LEVEL="INFO"
ALLOWED_ORIGINS="http://localhost:3000,https://curasense.yourdomain.com,https://curasense-frontend.vercel.app"
```

---

## 5. Deployment Environments

### Local Development
```
Frontend:  http://localhost:3000
ML API:    http://localhost:8000
Vision:    http://localhost:8001
Database:  Neon Cloud (dev instance)
```

### Docker Compose (docker-compose.dev.yaml)
Defined in [compose.dev.yaml](compose.dev.yaml):
- `NEXT_PUBLIC_FRONTEND_API=http://backend-ml:8000`
- `NEXT_TELEMETRY_DISABLED=1`

### Vercel Production
```
Frontend:  https://curasense-frontend.vercel.app
Database:  Neon DB (production)
ML APIs:   External deployment (Render/Railway)
```

**Vercel Environment Variables** (via Dashboard):
- `DATABASE_URL` (production pooled connection)
- `JWT_SECRET` (production secret)
- `JWT_REFRESH_SECRET` (production secret)
- `NEXT_PUBLIC_ML_API_URL` (external deployment URL)
- `NEXT_PUBLIC_VISION_API_URL` (external deployment URL)

---

## 6. Summary of All Keys

### By Service

| Service | Total Keys | Required | Optional |
|---------|-----------|----------|----------|
| Frontend | 10 | 6 | 4 |
| Database | 5 | 3 | 2 |
| ML Backend | 7 | 5 | 2 |
| FastAPI | 7 | 5 | 2 |

### By Category

| Category | Keys | Examples |
|----------|------|----------|
| **Database** | 3 | `DATABASE_URL`, `DATABASE_URL_DIRECT`, `PRISMA_DEBUG` |
| **Authentication** | 4 | `JWT_SECRET`, `JWT_REFRESH_SECRET`, `ACCESS_TOKEN_EXPIRES_IN`, `REFRESH_TOKEN_EXPIRES_IN` |
| **External APIs** | 5 | `GOOGLE_API_KEY`, `GROQ_API_KEY`, `TAVILY_API_KEY`, `OPENAI_API_KEY`, `HF_TOKEN` |
| **Services** | 2 | `NEXT_PUBLIC_ML_API_URL`, `NEXT_PUBLIC_VISION_API_URL` |
| **Application** | 4 | `NODE_ENV`, `NEXTAUTH_URL`, `NEXT_TELEMETRY_DISABLED`, `CREWAI_TRACING_ENABLED` |
| **Server** | 4 | `HOST`, `PORT` (×2 services) |
| **Logging/CORS** | 2 | `LOG_LEVEL`, `ALLOWED_ORIGINS` |

---

## 7. Checklist for Deployment

### Before Production Deployment

- [ ] **Frontend**
  - [ ] Set production `JWT_SECRET` (64+ random characters)
  - [ ] Set production `JWT_REFRESH_SECRET` (64+ random characters)
  - [ ] Point `NEXT_PUBLIC_ML_API_URL` to deployed ML backend
  - [ ] Point `NEXT_PUBLIC_VISION_API_URL` to deployed Vision backend
  - [ ] Verify `NEXTAUTH_URL` matches production domain
  - [ ] Use Neon production database in `DATABASE_URL`

- [ ] **Database**
  - [ ] Confirm JWT secrets match frontend
  - [ ] Use production Neon connection string
  - [ ] Test migrations with `DATABASE_URL_DIRECT` if needed

- [ ] **ML Backends**
  - [ ] Verify all API keys are valid and have sufficient quota
  - [ ] Set `ALLOWED_ORIGINS` to production domains
  - [ ] Configure appropriate `LOG_LEVEL` (INFO for production)
  - [ ] Test connectivity to external services

- [ ] **Environment Files**
  - [ ] Remove `.env.local` from version control
  - [ ] Keep `.env.example` updated with template values
  - [ ] Verify `.gitignore` protects `.env` files
  - [ ] Document any service-specific setup in README

---

## 8. Security Best Practices

1. **Never commit `.env` files** - Use `.gitignore`
2. **Rotate API keys** regularly for production
3. **Use strong secrets** - Minimum 64 characters for JWT secrets
4. **Environment-specific values** - Different keys for dev/staging/prod
5. **CORS configuration** - Only allow trusted origins
6. **Logging levels** - Use DEBUG only in development
7. **Vercel secrets** - Store via Vercel Dashboard, not in code
8. **Neon security** - Use pooled connections for serverless

---

## 9. Troubleshooting

### "DATABASE_URL not set"
- Check `.env` file exists in service directory
- Verify `DATABASE_URL` is not commented out
- Ensure correct format: `postgresql://...?sslmode=require`

### "JWT verification failed"
- Confirm `JWT_SECRET` matches across frontend and database
- Check tokens haven't expired (`ACCESS_TOKEN_EXPIRES_IN`)
- Verify secrets haven't been rotated without updating all services

### "API key quota exceeded"
- Check Groq, Tavily, or Google Cloud usage
- Rotate API keys if compromised
- Upgrade account tier if needed

### "CORS errors"
- Add frontend URL to `ALLOWED_ORIGINS` in ML backends
- For local: `http://localhost:3000`
- For production: `https://curasense-frontend.vercel.app`

---

## 10. File Locations Summary

```
.
├── curasense-frontend/
│   ├── .env (production)
│   ├── .env.development (local dev)
│   ├── .env.production (production template)
│   ├── .env.example (template)
│   └── src/lib/prisma.ts (uses DATABASE_URL)
├── curasense-database/
│   ├── .env (database config)
│   ├── .env.example (template)
│   └── prisma/ (migrations use DATABASE_URL)
├── curasense-ml/
│   ├── .env (ML backend config)
│   └── .env.example (template)
└── ml-fastapi/
    ├── .env (FastAPI config)
    └── .env.example (template)
```

---

**Last Updated**: January 18, 2026
**Status**: Complete with all services configured
