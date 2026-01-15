# ============================================
# CURASENSE FRONTEND - OPTIMIZED DOCKERFILE
# Build time reduced with layer caching
# ============================================

# Base image with minimal footprint
FROM node:22-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# ============================================
# DEPS STAGE - Cached dependency installation
# Only rebuilds when package*.json changes
# ============================================
FROM base AS deps
RUN apk add --no-cache libc6-compat

# Copy only package files first (better cache)
COPY package.json package-lock.json ./

# Use npm ci with cache mount for faster installs
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --no-fund

# ============================================
# PRISMA STAGE - Generate Prisma client separately
# Only rebuilds when schema changes
# ============================================
FROM base AS prisma
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
RUN npx prisma generate

# ============================================
# BUILDER STAGE - Build the Next.js app
# ============================================
FROM base AS builder

# Copy cached node_modules and generated prisma
COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma

# Copy source files (excluded by .dockerignore)
COPY . .

# Build with production optimizations
ENV NODE_ENV=production
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# ============================================
# RUNNER STAGE - Minimal production image
# ============================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only production artifacts
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
