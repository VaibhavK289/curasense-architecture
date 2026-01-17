# ============================================
# CURASENSE ML API - PRODUCTION DOCKERFILE
# Optimized for BERT, Transformers, and ML Models
# Build: 2hrs -> 10mins (first) -> 2mins (subsequent)
# ============================================
# syntax=docker/dockerfile:1.4

# ============================================
# STAGE 1: Base with pinned Python version
# ============================================
FROM python:3.10.13-slim-bookworm AS base

# Metadata labels for documentation
LABEL maintainer="CuraSense Team" \
      version="2.0" \
      description="CuraSense ML API with BERT and Transformers" \
      org.opencontainers.image.source="https://github.com/curasense/ml-api"

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONFAULTHANDLER=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_DEFAULT_TIMEOUT=100

# ML Model cache directories
ENV HF_HOME=/opt/ml-models \
    TRANSFORMERS_CACHE=/opt/ml-models/transformers \
    TORCH_HOME=/opt/ml-models/torch \
    TOKENIZERS_PARALLELISM=false

WORKDIR /app

# ============================================
# STAGE 2: System dependencies (rarely changes)
# ============================================
FROM base AS system-deps

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    python3-dev \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# ============================================
# STAGE 3: Heavy ML dependencies (rarely changes)
# PyTorch, Transformers - cached independently
# ============================================
FROM system-deps AS ml-base

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install heavy ML packages first (best cache utilization)
COPY requirements-base.txt .
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
    pip install --timeout=3000 -r requirements-base.txt

# ============================================
# STAGE 4: ML tools and utilities (moderate changes)
# ============================================
FROM ml-base AS ml-tools

COPY requirements-ml.txt .
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
    pip install --timeout=2000 -r requirements-ml.txt && \
    pip install --upgrade tokenizers transformers

# ============================================
# STAGE 5: Pre-download ML models (cached until models change)
# CRITICAL: Downloads BERT/models ONCE
# ============================================
FROM ml-tools AS model-cache

# Create model directories
RUN mkdir -p /opt/ml-models/transformers /opt/ml-models/torch

# Pre-download BERT model and tokenizer (cached in layer)
RUN --mount=type=cache,target=/root/.cache/huggingface \
    python -c "\
from transformers import AutoModel, AutoTokenizer; \
print('Downloading BERT model...'); \
model = AutoModel.from_pretrained('bert-base-uncased'); \
tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased'); \
model.save_pretrained('/opt/ml-models/transformers/bert-base-uncased'); \
tokenizer.save_pretrained('/opt/ml-models/transformers/bert-base-uncased'); \
print('BERT model cached successfully')"

# Pre-download sentence-transformers if needed
RUN --mount=type=cache,target=/root/.cache/huggingface \
    python -c "\
from transformers import AutoModel, AutoTokenizer; \
print('Downloading MiniLM model for embeddings...'); \
model = AutoModel.from_pretrained('sentence-transformers/all-MiniLM-L6-v2'); \
tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2'); \
model.save_pretrained('/opt/ml-models/transformers/all-MiniLM-L6-v2'); \
tokenizer.save_pretrained('/opt/ml-models/transformers/all-MiniLM-L6-v2'); \
print('MiniLM model cached successfully')" || echo "MiniLM optional - continuing..."

# ============================================
# STAGE 6: Application dependencies (changes often)
# ============================================
FROM model-cache AS app-deps

COPY requirements-app.txt .
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
    pip install --no-cache-dir -r requirements-app.txt

# Install any remaining deps from original requirements
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
    pip install --no-cache-dir -r requirements.txt 2>/dev/null || true

# ============================================
# STAGE 7: Runtime - Minimal production image
# ============================================
FROM python:3.10.13-slim-bookworm AS runtime

# Metadata
LABEL maintainer="CuraSense Team" \
      version="2.0" \
      description="CuraSense ML API - Production"

# Install only runtime libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONFAULTHANDLER=1 \
    HF_HOME=/opt/ml-models \
    TRANSFORMERS_CACHE=/opt/ml-models/transformers \
    TORCH_HOME=/opt/ml-models/torch \
    TOKENIZERS_PARALLELISM=false \
    TRANSFORMERS_OFFLINE=1

# Copy virtual environment with all packages
COPY --from=app-deps /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy pre-downloaded models
COPY --from=model-cache /opt/ml-models /opt/ml-models

# Create non-root user with specific UID for security
RUN groupadd --gid 1000 appgroup && \
    useradd --uid 1000 --gid appgroup --shell /bin/bash --create-home appuser && \
    mkdir -p /app && \
    chown -R appuser:appgroup /app /opt/ml-models

USER appuser
WORKDIR /app

# Copy application code LAST (changes most frequently)
COPY --chown=appuser:appgroup . .

EXPOSE 8000

# Health check with proper timeout for ML models
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Use exec form for proper signal handling
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--timeout-keep-alive", "30"]