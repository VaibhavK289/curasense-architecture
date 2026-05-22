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
# BUILDER STAGE - Build the Next.js app
# ============================================
FROM base AS builder

# Copy node_modules
COPY --from=deps /app/node_modules ./node_modules

# Copy source files (excluded by .dockerignore)
COPY . .

# Generate Prisma client (outputs to src/generated/prisma)
RUN npx prisma generate

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

# Create non-root user with specific UID for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs && \
    mkdir -p /app/.next /app/prisma && \
    chown -R nextjs:nodejs /app

# Copy only production artifacts
COPY --from=builder /app/public ./public
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
