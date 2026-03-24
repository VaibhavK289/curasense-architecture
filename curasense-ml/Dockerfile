FROM python:3.10-slim

# Prevent Python from writing .pyc files and keep logs interactive
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies for agentic libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# Increase timeout and use no-cache to ensure a clean install
RUN pip install --no-cache-dir --timeout=2000 -r requirements.txt

COPY . .

EXPOSE 8000