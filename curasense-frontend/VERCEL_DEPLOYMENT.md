# CuraSense Vercel Deployment Guide

> **Note**: ML backends are deployed on **Azure Container Apps**. See [azure_deployment_guide.md](../azure_deployment_guide.md) for Azure setup.

## Prerequisites

1. **GitHub Account** - Repository already at: https://github.com/VaibhavK289/curasense-architecture
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Neon DB Account** - Sign up at [neon.tech](https://neon.tech) (free tier available)
4. **Azure Account** - For ML backend deployment

## Step 1: Set Up Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project named "curasense"
3. Copy the **Pooled connection string** (looks like):
   ```
   postgresql://username:password@ep-xxx-xxx-pooler.region.neon.tech/neondb?sslmode=require
   ```
4. Note: Use the **pooled** connection for Vercel serverless (has `-pooler` in the hostname)

### Run Prisma Migrations on Neon

From your local machine, run:
```bash
cd curasense-frontend
DATABASE_URL="your-neon-connection-string" npx prisma migrate deploy
```

Or use Neon's SQL Editor to run the migration SQL.

## Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import from GitHub: `VaibhavK289/curasense-architecture`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `curasense-frontend`
   - **Build Command**: `next build`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   | Variable | Value | Environment |
   |----------|-------|-------------|
   | `DATABASE_URL` | Your Neon pooled connection string | Production, Preview |
   | `JWT_SECRET` | Generate with `openssl rand -base64 64` | Production, Preview |
   | `JWT_REFRESH_SECRET` | Generate another secret | Production, Preview |
   | `BACKEND_API_URL` | Your Azure ML API URL | Production, Preview |
   | `NEXT_PUBLIC_ML_API_URL` | Your Azure ML API URL | Production, Preview |
   | `NEXT_PUBLIC_VISION_API_URL` | Your Azure Vision API URL | Production, Preview |

6. Click "Deploy"

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd curasense-frontend

# Login and deploy
vercel login
vercel --prod
```

## Step 3: Deploy ML Backends on Azure

The Python ML backends (FastAPI) are deployed on **Azure Container Apps**.

### See Azure Deployment Guide

📖 **Full instructions**: [azure_deployment_guide.md](../azure_deployment_guide.md)

### Quick Reference

After Azure deployment, you'll have URLs like:
```
ML API: https://ml-api.xxx.centralindia.azurecontainerapps.io
Vision API: https://vision-api.xxx.centralindia.azurecontainerapps.io
```

Add these to Vercel environment variables:
- `BACKEND_API_URL=https://ml-api.xxx.centralindia.azurecontainerapps.io`
- `NEXT_PUBLIC_ML_API_URL=https://ml-api.xxx.centralindia.azurecontainerapps.io`
- `NEXT_PUBLIC_VISION_API_URL=https://vision-api.xxx.centralindia.azurecontainerapps.io`

## Step 4: Configure Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain: `curasense.yourdomain.com`
3. Update DNS records as instructed

## Environment Variables Reference

### Required for Vercel Deployment

```env
# Database (Neon - use POOLED connection string)
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.neon.tech/neondb?sslmode=require

# Authentication (generate secure random strings)
JWT_SECRET=your-64-character-secure-secret
JWT_REFRESH_SECRET=another-64-character-secure-secret

# ML Backends (Azure Container Apps URLs)
BACKEND_API_URL=https://ml-api.xxx.centralindia.azurecontainerapps.io
NEXT_PUBLIC_ML_API_URL=https://ml-api.xxx.centralindia.azurecontainerapps.io
NEXT_PUBLIC_VISION_API_URL=https://vision-api.xxx.centralindia.azurecontainerapps.io
```

### Optional

```env
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

## Serverless Optimization Features

This deployment is optimized for Vercel's free tier:

1. **Neon Serverless Driver** - Uses `@neondatabase/serverless` for faster cold starts
2. **Connection Pooling** - Single connection per serverless function
3. **Edge-Ready** - API routes are serverless functions
4. **Automatic Scaling** - Vercel handles scaling automatically
5. **Global CDN** - Static assets served from edge locations

## Vercel Free Tier Limits

- **Serverless Functions**: 100GB-Hrs execution/month
- **Bandwidth**: 100GB/month
- **Build Minutes**: 6000/month
- **Function Duration**: 60 seconds max (configured in vercel.json)

## Troubleshooting

### Build Fails

Ensure the build command is `next build` (Prisma is disabled for MVP mode).

### Database Connection Errors

1. Make sure you're using the **pooled** connection string (contains `-pooler`)
2. Verify SSL mode: `?sslmode=require`
3. Check Neon project isn't paused (free tier pauses after inactivity)

### ML Backend Errors

1. Verify `BACKEND_API_URL` is set correctly in Vercel
2. Test Azure backend health: `curl https://your-ml-api.azurecontainerapps.io/health`
3. Check Azure Container Apps logs for errors

### CORS Errors

Ensure Azure backends have `ALLOWED_ORIGINS` environment variable set to your Vercel URL:
```
ALLOWED_ORIGINS=https://curasense-frontend.vercel.app
```

## Post-Deployment Checklist

- [ ] Verify frontend loads correctly
- [ ] Test ML diagnosis endpoints
- [ ] Check X-ray analysis works
- [ ] Verify Azure backend health endpoints
- [ ] Set up monitoring (optional: Vercel Analytics)

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                   │
│                           │                                     │
│                           ▼                                     │
│                    ┌────────────────┐                           │
│                    │    VERCEL      │ ◄── Next.js Frontend      │
│                    │  (Free Tier)   │                           │
│                    └───────┬────────┘                           │
│                            │                                    │
│              ┌─────────────┴─────────────┐                      │
│              ▼                           ▼                      │
│     ┌────────────────┐          ┌────────────────┐              │
│     │   ML API       │          │  Vision API    │              │
│     │ Azure ACA      │          │  Azure ACA     │              │
│     │ Port 8000      │          │  Port 8001     │              │
│     └────────────────┘          └────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## Support

For issues, check:
- [Vercel Docs](https://vercel.com/docs)
- [Azure Container Apps Docs](https://docs.microsoft.com/azure/container-apps/)
- [Next.js Docs](https://nextjs.org/docs)
