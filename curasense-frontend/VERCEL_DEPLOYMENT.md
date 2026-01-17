# CuraSense Vercel Deployment Guide

## Prerequisites

1. **GitHub Account** - Repository already at: https://github.com/VaibhavK289/curasense-architecture
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Neon DB Account** - Sign up at [neon.tech](https://neon.tech) (free tier available)

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
   - **Build Command**: `prisma generate && next build`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   | Variable | Value | Environment |
   |----------|-------|-------------|
   | `DATABASE_URL` | Your Neon pooled connection string | Production, Preview |
   | `JWT_SECRET` | Generate with `openssl rand -base64 64` | Production, Preview |
   | `JWT_REFRESH_SECRET` | Generate another secret | Production, Preview |
   | `NEXT_PUBLIC_ML_API_URL` | Your ML backend URL (see below) | Production, Preview |
   | `NEXT_PUBLIC_VISION_API_URL` | Your Vision backend URL | Production, Preview |

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

## Step 3: Deploy ML Backends

The Python ML backends (FastAPI) need to be deployed separately since Vercel doesn't support Python runtimes for long-running ML tasks.

### Recommended: Deploy to Render (Free Tier)

1. Go to [render.com](https://render.com) and sign up
2. Create a new Web Service for each backend:

#### ML Backend (Port 8000)
- **Repository**: Same GitHub repo
- **Root Directory**: `ml-fastapi`
- **Runtime**: Python 3
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**: Add your API keys (Gemini, etc.)

#### Vision Backend (Port 8001)
- **Repository**: Same GitHub repo
- **Root Directory**: `curasense-ml`
- **Runtime**: Python 3
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`

3. Copy the Render URLs and add them to Vercel environment variables:
   - `NEXT_PUBLIC_ML_API_URL=https://curasense-ml.onrender.com`
   - `NEXT_PUBLIC_VISION_API_URL=https://curasense-vision.onrender.com`

### Alternative: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Deploy each backend as a separate service

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

# ML Backends (use your deployed URLs)
NEXT_PUBLIC_ML_API_URL=https://your-ml-backend.onrender.com
NEXT_PUBLIC_VISION_API_URL=https://your-vision-backend.onrender.com
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

### Build Fails: Prisma Generate

Ensure `postinstall` script exists in package.json:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Database Connection Errors

1. Make sure you're using the **pooled** connection string (contains `-pooler`)
2. Verify SSL mode: `?sslmode=require`
3. Check Neon project isn't paused (free tier pauses after inactivity)

### ML Backend Timeouts

The ML backends may spin down on free tiers. First request after idle may take 30-60 seconds.

### CORS Errors

Ensure ML backends have CORS configured for your Vercel domain:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://curasense.vercel.app", "https://your-domain.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Post-Deployment Checklist

- [ ] Verify database connection works
- [ ] Test user registration/login
- [ ] Test ML diagnosis endpoints
- [ ] Check X-ray analysis works
- [ ] Verify all pages load correctly
- [ ] Set up monitoring (optional: Vercel Analytics)

## Support

For issues, create a GitHub issue or check:
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Next.js Docs](https://nextjs.org/docs)
