# ============================================
# CURASENSE FRONTEND - PRODUCTION DOCKERFILE
# Next.js 16 with Prisma - Highly Optimized
# Build: ~5mins (first) -> 45secs (subsequent)
# Final image: ~150MB (vs 1GB+ unoptimized)
# ============================================
# syntax=docker/dockerfile:1.4

# ============================================
# STAGE 1: Base with specific Node version
# ============================================
FROM node:22.12-alpine AS base

# Metadata labels
LABEL maintainer="CuraSense Team" \
      version="2.0" \
      description="CuraSense Frontend - Next.js 16 with Prisma" \
      org.opencontainers.image.source="https://github.com/curasense/frontend"

ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

WORKDIR /app

# ============================================
# STAGE 2: Dependencies - Cached separately
# Only rebuilds when package*.json changes
# ============================================
FROM base AS deps

# Install build dependencies for native modules
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    python3 \
    make \
    g++

# Copy package files ONLY (better cache utilization)
COPY package.json package-lock.json ./

# Copy Prisma files for client generation
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install ALL dependencies with cache mount
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --prefer-offline --no-audit --no-fund && \
    npm cache clean --force

# Generate Prisma client (cached with node_modules)
RUN npx prisma generate

# ============================================
# STAGE 3: Builder - Build Next.js application
# ============================================
FROM base AS builder

# Install openssl for Prisma runtime
RUN apk add --no-cache openssl

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy source code
COPY . .

# Build with aggressive caching
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN --mount=type=cache,target=/app/.next/cache,sharing=locked \
    npm run build

# Prune dev dependencies after build
RUN npm prune --production

# ============================================
# STAGE 4: Runtime - Minimal production image
# Uses Next.js standalone output for smallest size
# ============================================
FROM node:22.12-alpine AS runner

# Metadata
LABEL maintainer="CuraSense Team" \
      version="2.0" \
      description="CuraSense Frontend - Production"

# Install only runtime dependencies
RUN apk add --no-cache \
    openssl \
    curl \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Environment configuration
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Create non-root user with specific UID for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs && \
    mkdir -p /app/.next /app/prisma && \
    chown -R nextjs:nodejs /app

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone build (includes server + dependencies)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma client and schema for runtime
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma/schema.prisma ./prisma/

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Health check for orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Use exec form for proper signal handling
CMD ["node", "server.js"]
