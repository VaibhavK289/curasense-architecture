#!/bin/bash
# =============================================================
# CuraSense EC2 Deployment Script
# =============================================================
# Run this on a fresh Ubuntu 22.04+ EC2 instance (t3.xlarge recommended)
#
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh
#
# Prerequisites:
#   - EC2 instance with Ubuntu 22.04+
#   - Security group: port 22 (SSH) + port 3000 (frontend)
#   - At least 30 GB EBS storage (gp3)
# =============================================================

set -euo pipefail

echo "============================================="
echo " CuraSense Deployment — EC2 Bootstrap"
echo "============================================="

# --- 1. Install Docker ---
echo "[1/6] Installing Docker..."
if ! command -v docker &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
        sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo usermod -aG docker $USER
    echo "Docker installed. You may need to log out and back in for group changes."
else
    echo "Docker already installed."
fi

# --- 2. Clone repositories ---
echo "[2/6] Cloning repositories..."
DEPLOY_DIR="$HOME/curasense"
mkdir -p "$DEPLOY_DIR"

if [ ! -d "$DEPLOY_DIR/curasense-architecture" ]; then
    git clone https://github.com/VaibhavK289/curasense-architecture.git "$DEPLOY_DIR/curasense-architecture"
else
    echo "Main repo already exists, pulling latest..."
    cd "$DEPLOY_DIR/curasense-architecture" && git pull
fi

if [ ! -d "$DEPLOY_DIR/medicine_model_curasense" ]; then
    git clone https://github.com/VaibhavK289/medicine_model_curasense.git "$DEPLOY_DIR/medicine_model_curasense"
else
    echo "Medicine model repo already exists, pulling latest..."
    cd "$DEPLOY_DIR/medicine_model_curasense" && git pull
fi

# --- 3. Create .env file ---
echo "[3/6] Setting up environment..."
cd "$DEPLOY_DIR/curasense-architecture"

if [ ! -f .env ]; then
    cp .env.example .env
    echo ""
    echo "============================================="
    echo " ACTION REQUIRED: Edit .env file"
    echo "============================================="
    echo " nano $DEPLOY_DIR/curasense-architecture/.env"
    echo ""
    echo " Fill in ALL values (API keys, DATABASE_URL, JWT_SECRET, etc.)"
    echo " Then re-run this script."
    echo "============================================="
    exit 0
else
    echo ".env file exists."
fi

# --- 4. Update NEXT_PUBLIC_APP_URL with EC2 public IP ---
echo "[4/6] Detecting EC2 public IP..."
EC2_IP=$(curl -s --connect-timeout 5 http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "")

if [ -n "$EC2_IP" ]; then
    echo "EC2 Public IP: $EC2_IP"
    # Update NEXT_PUBLIC_APP_URL if it's still the default
    if grep -q "NEXT_PUBLIC_APP_URL=http://localhost:3000" .env; then
        sed -i "s|NEXT_PUBLIC_APP_URL=http://localhost:3000|NEXT_PUBLIC_APP_URL=http://$EC2_IP:3000|" .env
        echo "Updated NEXT_PUBLIC_APP_URL to http://$EC2_IP:3000"
    fi
else
    echo "Could not detect EC2 public IP (not on EC2 or IMDSv2 required)."
    echo "Make sure NEXT_PUBLIC_APP_URL is set correctly in .env"
fi

# --- 5. Build and start all services ---
echo "[5/6] Building and starting containers..."
echo "This will take 10-20 minutes on first build (downloading models)..."
docker compose up -d --build

# --- 6. Verify ---
echo "[6/6] Verifying services..."
echo "Waiting 30 seconds for services to start..."
sleep 30

echo ""
echo "Service health checks:"
echo "---------------------------------------------"

for service in "ml-api:8000/health" "vision-api:8001/ping" "medicine-api:8002/health" "frontend:3000/api/health"; do
    name=$(echo $service | cut -d: -f1)
    url="http://localhost:$(echo $service | cut -d: -f2)"
    if curl -sf "$url" > /dev/null 2>&1; then
        echo "  $name: OK"
    else
        echo "  $name: STARTING (may need more time)"
    fi
done

echo ""
echo "============================================="
echo " Deployment complete!"
echo "============================================="
if [ -n "$EC2_IP" ]; then
    echo " Access CuraSense at: http://$EC2_IP:3000"
else
    echo " Access CuraSense at: http://localhost:3000"
fi
echo ""
echo " Useful commands:"
echo "   docker compose logs -f          # View all logs"
echo "   docker compose logs -f ml-api   # View specific service"
echo "   docker compose ps               # Check service status"
echo "   docker compose down             # Stop all services"
echo "   docker compose up -d            # Start all services"
echo "   docker compose up -d --build    # Rebuild and restart"
echo "============================================="
