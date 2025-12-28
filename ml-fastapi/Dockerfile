FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies for ChromaDB/Vector storage
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# Increase timeout and use no-cache to ensure a clean install
RUN pip install --no-cache-dir --timeout=1000 -r requirements.txt

COPY . .

EXPOSE 8001