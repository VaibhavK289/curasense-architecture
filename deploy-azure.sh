#!/bin/bash
# ============================================================
#  CuraSense — Azure Container Apps Deployment Script
#  Run this in Azure Cloud Shell (https://shell.azure.com)
# ============================================================
#  Deploys 3 microservices:
#    1. curasense-frontend  (Next.js)       → port 3000
#    2. curasense-ml        (CrewAI/FastAPI) → port 8000
#    3. curasense-vision    (FastAPI)        → port 8001
# ============================================================
#
#  SETUP:
#    1. Copy .env.azure.template → .env.azure
#    2. Fill in your secret values in .env.azure
#    3. Run: bash deploy-azure.sh
#
# ============================================================

set -euo pipefail

# ─────────────── LOAD SECRETS ───────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env.azure"

if [ ! -f "$ENV_FILE" ]; then
    # If running from Cloud Shell after clone, check current dir too
    ENV_FILE=".env.azure"
fi

if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: .env.azure not found!"
    echo "  1. Copy .env.azure.template to .env.azure"
    echo "  2. Fill in your secret values"
    echo "  3. Run this script again"
    exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

# ─────────────── CONFIGURATION ───────────────
# Change these values as needed
RESOURCE_GROUP="${RESOURCE_GROUP:-curasense-rg}"
LOCATION="${LOCATION:-centralindia}"
ACR_NAME="${ACR_NAME:-curasenseacr}"                         # Must be globally unique, lowercase, no hyphens
ENVIRONMENT_NAME="${ENVIRONMENT_NAME:-curasense-env}"
LOG_ANALYTICS_WORKSPACE="${LOG_ANALYTICS_WORKSPACE:-curasense-logs}"

# Container App names
FRONTEND_APP="curasense-frontend"
BACKEND_ML_APP="curasense-ml"
BACKEND_VISION_APP="curasense-vision"

# Image tags
IMAGE_TAG="latest"
FRONTEND_IMAGE="${ACR_NAME}.azurecr.io/curasense-frontend:${IMAGE_TAG}"
BACKEND_ML_IMAGE="${ACR_NAME}.azurecr.io/curasense-ml:${IMAGE_TAG}"
BACKEND_VISION_IMAGE="${ACR_NAME}.azurecr.io/curasense-vision:${IMAGE_TAG}"

# GitHub repository
GITHUB_REPO="https://github.com/VaibhavK289/curasense-architecture.git"
GITHUB_BRANCH="stable-v2"

# ─────────────── VALIDATE REQUIRED SECRETS ───────────────
MISSING_VARS=()
for var in DB_URL JWT_SECRET JWT_REFRESH_SECRET \
           ML_GOOGLE_API_KEY ML_GROQ_API_KEY ML_TAVILY_API_KEY \
           VISION_GOOGLE_API_KEY VISION_GROQ_API_KEY VISION_TAVILY_API_KEY \
           VISION_HF_TOKEN VISION_GOOGLE_CREDS_B64; do
    if [ -z "${!var:-}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "ERROR: The following required variables are missing in .env.azure:"
    for v in "${MISSING_VARS[@]}"; do echo "  - $v"; done
    exit 1
fi

# ─────────────── COLORS ───────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_step() { echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; echo -e "${GREEN}▸ $1${NC}"; echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }
print_info()  { echo -e "${YELLOW}  ℹ $1${NC}"; }
print_error() { echo -e "${RED}  ✗ $1${NC}"; }
print_ok()    { echo -e "${GREEN}  ✓ $1${NC}"; }

# ============================================================
#  PHASE 0 — PRE-FLIGHT CHECKS
# ============================================================
print_step "Phase 0: Pre-flight checks"

# Verify Azure CLI is available
if ! command -v az &> /dev/null; then
    print_error "Azure CLI not found. Run this script in Azure Cloud Shell."
    exit 1
fi
print_ok "Azure CLI found"

# Check login status
ACCOUNT=$(az account show --query name -o tsv 2>/dev/null || true)
if [ -z "$ACCOUNT" ]; then
    print_info "Not logged in. Logging in..."
    az login
else
    print_ok "Logged in to: $ACCOUNT"
fi

# Show subscription
SUB_NAME=$(az account show --query name -o tsv)
SUB_ID=$(az account show --query id -o tsv)
print_info "Subscription: $SUB_NAME ($SUB_ID)"

# Install/upgrade Container Apps extension
print_info "Ensuring Container Apps extension is installed..."
az extension add --name containerapp --upgrade --yes 2>/dev/null || true
print_ok "Container Apps extension ready"

# Register required providers
print_info "Registering resource providers (may take a minute)..."
az provider register --namespace Microsoft.App --wait 2>/dev/null || true
az provider register --namespace Microsoft.OperationalInsights --wait 2>/dev/null || true
print_ok "Resource providers registered"

# ============================================================
#  PHASE 1 — RESOURCE GROUP & ACR
# ============================================================
print_step "Phase 1: Create Resource Group & Container Registry"

# Create Resource Group
print_info "Creating resource group: $RESOURCE_GROUP in $LOCATION"
az group create \
    --name "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --output none
print_ok "Resource group created"

# Create Azure Container Registry
print_info "Creating container registry: $ACR_NAME"
az acr create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$ACR_NAME" \
    --sku Basic \
    --admin-enabled true \
    --output none
print_ok "Container registry created"

# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name "$ACR_NAME" --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name "$ACR_NAME" --query "passwords[0].value" -o tsv)
ACR_LOGIN_SERVER=$(az acr show --name "$ACR_NAME" --query loginServer -o tsv)
print_ok "ACR credentials retrieved: $ACR_LOGIN_SERVER"

# ============================================================
#  PHASE 2 — CLONE REPO & BUILD IMAGES
# ============================================================
print_step "Phase 2: Clone repository & build Docker images"

WORK_DIR="$HOME/curasense-deploy"
if [ -d "$WORK_DIR" ]; then
    print_info "Cleaning existing work directory..."
    rm -rf "$WORK_DIR"
fi

print_info "Cloning repository..."
git clone --branch "$GITHUB_BRANCH" --depth 1 "$GITHUB_REPO" "$WORK_DIR"
cd "$WORK_DIR"
print_ok "Repository cloned"

# Login to ACR
print_info "Logging into ACR..."
az acr login --name "$ACR_NAME"
print_ok "ACR login successful"

# ── Build Frontend ──
print_info "Building frontend image (this may take 5-10 minutes)..."
az acr build \
    --registry "$ACR_NAME" \
    --image "curasense-frontend:${IMAGE_TAG}" \
    --file curasense-frontend/Dockerfile \
    curasense-frontend/
print_ok "Frontend image built and pushed"

# ── Build Backend ML ──
print_info "Building backend-ml image (this may take 5-10 minutes)..."
az acr build \
    --registry "$ACR_NAME" \
    --image "curasense-ml:${IMAGE_TAG}" \
    --file curasense-ml/Dockerfile \
    curasense-ml/
print_ok "Backend ML image built and pushed"

# ── Build Backend Vision ──
print_info "Building backend-vision image (this may take 5-10 minutes)..."
az acr build \
    --registry "$ACR_NAME" \
    --image "curasense-vision:${IMAGE_TAG}" \
    --file ml-fastapi/Dockerfile \
    ml-fastapi/
print_ok "Backend Vision image built and pushed"

# ============================================================
#  PHASE 3 — CONTAINER APPS ENVIRONMENT
# ============================================================
print_step "Phase 3: Create Container Apps Environment"

# Create Log Analytics workspace
print_info "Creating Log Analytics workspace..."
az monitor log-analytics workspace create \
    --resource-group "$RESOURCE_GROUP" \
    --workspace-name "$LOG_ANALYTICS_WORKSPACE" \
    --location "$LOCATION" \
    --output none
print_ok "Log Analytics workspace created"

LOG_ANALYTICS_ID=$(az monitor log-analytics workspace show \
    --resource-group "$RESOURCE_GROUP" \
    --workspace-name "$LOG_ANALYTICS_WORKSPACE" \
    --query customerId -o tsv)

LOG_ANALYTICS_KEY=$(az monitor log-analytics workspace get-shared-keys \
    --resource-group "$RESOURCE_GROUP" \
    --workspace-name "$LOG_ANALYTICS_WORKSPACE" \
    --query primarySharedKey -o tsv)

# Create Container Apps Environment
print_info "Creating Container Apps environment: $ENVIRONMENT_NAME"
az containerapp env create \
    --name "$ENVIRONMENT_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --logs-workspace-id "$LOG_ANALYTICS_ID" \
    --logs-workspace-key "$LOG_ANALYTICS_KEY" \
    --output none
print_ok "Container Apps environment created"

# ============================================================
#  PHASE 4 — DEPLOY BACKEND SERVICES (first, so frontend can reference them)
# ============================================================
print_step "Phase 4: Deploy backend services"

# ── Deploy Backend ML (CrewAI) ──
print_info "Deploying backend-ml (CrewAI)..."
az containerapp create \
    --name "$BACKEND_ML_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --environment "$ENVIRONMENT_NAME" \
    --image "$BACKEND_ML_IMAGE" \
    --registry-server "$ACR_LOGIN_SERVER" \
    --registry-username "$ACR_USERNAME" \
    --registry-password "$ACR_PASSWORD" \
    --target-port 8000 \
    --ingress external \
    --min-replicas 0 \
    --max-replicas 3 \
    --cpu 1.0 \
    --memory 2.0Gi \
    --env-vars \
        GOOGLE_API_KEY="$ML_GOOGLE_API_KEY" \
        GROQ_API_KEY="$ML_GROQ_API_KEY" \
        TAVILY_API_KEY="$ML_TAVILY_API_KEY" \
        HOST="0.0.0.0" \
        PORT="8000" \
        LOG_LEVEL="INFO" \
        ALLOWED_ORIGINS="*" \
    --output none
print_ok "Backend ML deployed"

# Get Backend ML FQDN
ML_FQDN=$(az containerapp show \
    --name "$BACKEND_ML_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --query "properties.configuration.ingress.fqdn" -o tsv)
ML_URL="https://${ML_FQDN}"
print_ok "Backend ML URL: $ML_URL"

# ── Deploy Backend Vision (FastAPI) ──
print_info "Deploying backend-vision (FastAPI)..."
az containerapp create \
    --name "$BACKEND_VISION_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --environment "$ENVIRONMENT_NAME" \
    --image "$BACKEND_VISION_IMAGE" \
    --registry-server "$ACR_LOGIN_SERVER" \
    --registry-username "$ACR_USERNAME" \
    --registry-password "$ACR_PASSWORD" \
    --target-port 8001 \
    --ingress external \
    --min-replicas 0 \
    --max-replicas 3 \
    --cpu 1.0 \
    --memory 2.0Gi \
    --command "uvicorn" "main:app" "--host" "0.0.0.0" "--port" "8001" \
    --env-vars \
        GOOGLE_API_KEY="$VISION_GOOGLE_API_KEY" \
        GROQ_API_KEY="$VISION_GROQ_API_KEY" \
        TAVILY_API_KEY="$VISION_TAVILY_API_KEY" \
        GOOGLE_CREDENTIALS_BASE64="$VISION_GOOGLE_CREDS_B64" \
        HF_TOKEN="$VISION_HF_TOKEN" \
        HOST="0.0.0.0" \
        PORT="8001" \
        LOG_LEVEL="INFO" \
        ALLOWED_ORIGINS="*" \
    --output none
print_ok "Backend Vision deployed"

# Get Backend Vision FQDN
VISION_FQDN=$(az containerapp show \
    --name "$BACKEND_VISION_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --query "properties.configuration.ingress.fqdn" -o tsv)
VISION_URL="https://${VISION_FQDN}"
print_ok "Backend Vision URL: $VISION_URL"

# ============================================================
#  PHASE 5 — DEPLOY FRONTEND (with backend URLs)
# ============================================================
print_step "Phase 5: Deploy frontend"

print_info "Deploying frontend (Next.js)..."
az containerapp create \
    --name "$FRONTEND_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --environment "$ENVIRONMENT_NAME" \
    --image "$FRONTEND_IMAGE" \
    --registry-server "$ACR_LOGIN_SERVER" \
    --registry-username "$ACR_USERNAME" \
    --registry-password "$ACR_PASSWORD" \
    --target-port 3000 \
    --ingress external \
    --min-replicas 0 \
    --max-replicas 3 \
    --cpu 0.5 \
    --memory 1.0Gi \
    --env-vars \
        DATABASE_URL="$DB_URL" \
        JWT_SECRET="$JWT_SECRET" \
        JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET" \
        ACCESS_TOKEN_EXPIRES_IN="15m" \
        REFRESH_TOKEN_EXPIRES_IN="7d" \
        BACKEND_API_URL="$ML_URL" \
        NEXT_PUBLIC_ML_API_URL="$ML_URL" \
        NEXT_PUBLIC_VISION_API_URL="$VISION_URL" \
        NODE_ENV="production" \
        NEXT_TELEMETRY_DISABLED="1" \
    --output none
print_ok "Frontend deployed"

# Get Frontend FQDN
FRONTEND_FQDN=$(az containerapp show \
    --name "$FRONTEND_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --query "properties.configuration.ingress.fqdn" -o tsv)
FRONTEND_URL="https://${FRONTEND_FQDN}"
print_ok "Frontend URL: $FRONTEND_URL"

# ============================================================
#  PHASE 6 — UPDATE CORS FOR BACKENDS
# ============================================================
print_step "Phase 6: Update CORS on backend services"

print_info "Updating backend-ml CORS to allow frontend..."
az containerapp update \
    --name "$BACKEND_ML_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --set-env-vars \
        ALLOWED_ORIGINS="$FRONTEND_URL,http://localhost:3000" \
    --output none
print_ok "Backend ML CORS updated"

print_info "Updating backend-vision CORS to allow frontend..."
az containerapp update \
    --name "$BACKEND_VISION_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --set-env-vars \
        ALLOWED_ORIGINS="$FRONTEND_URL,http://localhost:3000" \
    --output none
print_ok "Backend Vision CORS updated"

# ============================================================
#  PHASE 7 — CONFIGURE INGRESS CORS POLICY
# ============================================================
print_step "Phase 7: Configure ingress CORS policies"

# Set CORS policy on backend-ml
print_info "Setting CORS policy on backend-ml ingress..."
az containerapp ingress cors enable \
    --name "$BACKEND_ML_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --allowed-origins "$FRONTEND_URL" "http://localhost:3000" \
    --allowed-methods "GET" "POST" "PUT" "DELETE" "OPTIONS" \
    --allowed-headers "*" \
    --max-age 3600 \
    --output none 2>/dev/null || print_info "CORS policy set via env vars (ingress CORS not needed)"

# Set CORS policy on backend-vision
print_info "Setting CORS policy on backend-vision ingress..."
az containerapp ingress cors enable \
    --name "$BACKEND_VISION_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --allowed-origins "$FRONTEND_URL" "http://localhost:3000" \
    --allowed-methods "GET" "POST" "PUT" "DELETE" "OPTIONS" \
    --allowed-headers "*" \
    --max-age 3600 \
    --output none 2>/dev/null || print_info "CORS policy set via env vars (ingress CORS not needed)"

print_ok "CORS policies configured"

# ============================================================
#  PHASE 8 — VERIFY DEPLOYMENTS
# ============================================================
print_step "Phase 8: Verifying deployments"

print_info "Checking container app statuses..."
for APP in "$FRONTEND_APP" "$BACKEND_ML_APP" "$BACKEND_VISION_APP"; do
    STATUS=$(az containerapp show \
        --name "$APP" \
        --resource-group "$RESOURCE_GROUP" \
        --query "properties.runningStatus" -o tsv 2>/dev/null || echo "Unknown")
    PROVISIONING=$(az containerapp show \
        --name "$APP" \
        --resource-group "$RESOURCE_GROUP" \
        --query "properties.provisioningState" -o tsv 2>/dev/null || echo "Unknown")
    print_info "$APP → Provisioning: $PROVISIONING"
done

# ============================================================
#  DEPLOYMENT COMPLETE
# ============================================================
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║        ${GREEN}🎉 CuraSense Deployment Complete! 🎉${CYAN}              ║${NC}"
echo -e "${CYAN}╠════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}║  ${GREEN}Frontend:${NC}        $FRONTEND_URL"
echo -e "${CYAN}║  ${GREEN}Backend ML:${NC}      $ML_URL"
echo -e "${CYAN}║  ${GREEN}Backend Vision:${NC}  $VISION_URL"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}║  ${YELLOW}Resource Group:${NC}  $RESOURCE_GROUP"
echo -e "${CYAN}║  ${YELLOW}Location:${NC}        $LOCATION"
echo -e "${CYAN}║  ${YELLOW}Registry:${NC}        $ACR_LOGIN_SERVER"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}╠════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  ${YELLOW}Next Steps:${NC}                                              ║${NC}"
echo -e "${CYAN}║  1. Visit the Frontend URL in your browser                ║${NC}"
echo -e "${CYAN}║  2. Test ML endpoints: \$ML_URL/docs                      ║${NC}"
echo -e "${CYAN}║  3. Test Vision endpoints: \$VISION_URL/docs              ║${NC}"
echo -e "${CYAN}║  4. Check logs: az containerapp logs show ...             ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Save deployment info to file
cat > "$HOME/curasense-deployment-info.txt" <<EOF
CuraSense Azure Deployment Info
================================
Date: $(date)
Resource Group: $RESOURCE_GROUP
Location: $LOCATION
Container Registry: $ACR_LOGIN_SERVER

Frontend URL: $FRONTEND_URL
Backend ML URL: $ML_URL
Backend Vision URL: $VISION_URL

Useful Commands:
  # View frontend logs
  az containerapp logs show -n $FRONTEND_APP -g $RESOURCE_GROUP --follow

  # View backend-ml logs
  az containerapp logs show -n $BACKEND_ML_APP -g $RESOURCE_GROUP --follow

  # View backend-vision logs
  az containerapp logs show -n $BACKEND_VISION_APP -g $RESOURCE_GROUP --follow

  # Scale frontend
  az containerapp update -n $FRONTEND_APP -g $RESOURCE_GROUP --min-replicas 1 --max-replicas 5

  # Restart a container app
  az containerapp revision restart -n $FRONTEND_APP -g $RESOURCE_GROUP --revision \$(az containerapp revision list -n $FRONTEND_APP -g $RESOURCE_GROUP --query "[0].name" -o tsv)

  # Delete everything (CAUTION)
  az group delete -n $RESOURCE_GROUP --yes --no-wait
EOF

print_ok "Deployment info saved to ~/curasense-deployment-info.txt"
