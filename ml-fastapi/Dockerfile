# ============================================
# CURASENSE VISION API - PRODUCTION DOCKERFILE
# Optimized for RAG, Vision Analysis, ChromaDB
# Build: ~8mins (first) -> 1min (subsequent)
# ============================================
# syntax=docker/dockerfile:1.4

# ============================================
# STAGE 1: Base with pinned Python version
# ============================================
FROM python:3.10.13-slim-bookworm AS base

# Metadata labels
LABEL maintainer="CuraSense Team" \
      version="2.0" \
      description="CuraSense Vision API with RAG and ChromaDB" \
      org.opencontainers.image.source="https://github.com/curasense/vision-api"

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONFAULTHANDLER=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_DEFAULT_TIMEOUT=100

WORKDIR /app

# ============================================
# STAGE 2: System dependencies (rarely changes)
# ============================================
FROM base AS system-deps

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    python3-dev \
    libgomp1 \
    curl \
    # Image processing dependencies for Pillow
    libjpeg-dev \
    libpng-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# ============================================
# STAGE 3: Heavy dependencies (rarely changes)
# LangChain, ChromaDB - cached independently
# ============================================
FROM system-deps AS heavy-deps

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Create split requirements for better caching
# Install heavy packages first
COPY requirements.txt .

# Install core heavy dependencies
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
    pip install --timeout=2000 \
    langchain \
    langchain-core \
    langchain_community \
    langgraph \
    chromadb \
    google-generativeai

# ============================================
# STAGE 4: Application dependencies
# ============================================
FROM heavy-deps AS app-deps

# Install remaining dependencies
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
    pip install --timeout=2000 -r requirements.txt

# Verify critical packages installed
RUN python -c "import langchain; import chromadb; import fastapi; print('All packages verified')"

# ============================================
# STAGE 5: Runtime - Minimal production image
# ============================================
FROM python:3.10.13-slim-bookworm AS runtime

# Metadata
LABEL maintainer="CuraSense Team" \
      version="2.0" \
      description="CuraSense Vision API - Production"

# Install only runtime libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    curl \
    libjpeg62-turbo \
    libpng16-16 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONFAULTHANDLER=1

# Copy virtual environment with all packages
COPY --from=app-deps /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Create non-root user with specific UID
RUN groupadd --gid 1000 appgroup && \
    useradd --uid 1000 --gid appgroup --shell /bin/bash --create-home appuser && \
    mkdir -p /app /app/data /app/.chroma && \
    chown -R appuser:appgroup /app

USER appuser
WORKDIR /app

# Copy application code LAST (changes most frequently)
COPY --chown=appuser:appgroup . .

# Create data directories for ChromaDB persistence
RUN mkdir -p /app/data/chroma

EXPOSE 8001

# Health check with proper timeout
HEALTHCHECK --interval=30s --timeout=15s --start-period=45s --retries=3 \
    CMD curl -f http://localhost:8001/health || exit 1

# Use exec form for proper signal handling
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001", "--workers", "2", "--timeout-keep-alive", "30"]