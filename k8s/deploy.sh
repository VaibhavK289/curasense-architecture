#!/bin/bash

# ============================================
# CURASENSE KUBERNETES DEPLOYMENT SCRIPT
# Automated setup for production deployment
# ============================================

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed"
        exit 1
    fi
    log_success "kubectl found"
    
    if ! command -v docker &> /dev/null; then
        log_error "docker is not installed"
        exit 1
    fi
    log_success "docker found"
    
    # Check kubernetes connection
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    log_success "Connected to Kubernetes cluster"
}

build_images() {
    log_info "Building Docker images..."
    
    REGISTRY=${1:-"localhost"}
    
    log_info "Building frontend image..."
    docker build -t ${REGISTRY}/curasense-frontend:latest curasense-frontend/
    log_success "Frontend image built"
    
    log_info "Building ML backend image..."
    docker build -t ${REGISTRY}/curasense-backend-ml:latest ml-fastapi/
    log_success "ML backend image built"
    
    log_info "Building Vision backend image..."
    docker build -t ${REGISTRY}/curasense-backend-vision:latest ml-fastapi/
    log_success "Vision backend image built"
}

push_images() {
    log_info "Pushing Docker images..."
    
    REGISTRY=${1:-"localhost"}
    
    docker push ${REGISTRY}/curasense-frontend:latest
    docker push ${REGISTRY}/curasense-backend-ml:latest
    docker push ${REGISTRY}/curasense-backend-vision:latest
    
    log_success "Images pushed to registry"
}

update_manifests() {
    log_info "Updating Kubernetes manifests with image registry..."
    
    REGISTRY=${1:-"localhost"}
    
    # Update frontend image
    sed -i "s|image: curasense-frontend:latest|image: ${REGISTRY}/curasense-frontend:latest|g" k8s/curasense-complete.yaml
    sed -i "s|image: curasense-frontend:latest|image: ${REGISTRY}/curasense-frontend:latest|g" k8s/frontend/frontend-deployment.yaml
    
    # Update ML image
    sed -i "s|image: curasense-backend-ml:latest|image: ${REGISTRY}/curasense-backend-ml:latest|g" k8s/curasense-complete.yaml
    sed -i "s|image: curasense-backend-ml:latest|image: ${REGISTRY}/curasense-backend-ml:latest|g" k8s/backend-ml/ml-deployment-complete.yaml
    
    # Update Vision image
    sed -i "s|image: curasense-backend-vision:latest|image: ${REGISTRY}/curasense-backend-vision:latest|g" k8s/curasense-complete.yaml
    sed -i "s|image: curasense-backend-vision:latest|image: ${REGISTRY}/curasense-backend-vision:latest|g" k8s/backend-vision/vision-deployment-complete.yaml
    
    log_success "Manifests updated"
}

create_namespace() {
    log_info "Creating namespace..."
    
    if kubectl get namespace curasense &> /dev/null; then
        log_warning "Namespace 'curasense' already exists"
    else
        kubectl create namespace curasense
        log_success "Namespace 'curasense' created"
    fi
}

create_secrets() {
    log_info "Creating secrets..."
    
    # Generate random secret if not provided
    NEXTAUTH_SECRET=$(openssl rand -hex 32)
    
    log_info "NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}"
    log_warning "Save this secret in a secure location!"
    
    kubectl create secret generic curasense-secrets \
      --from-literal=NEXTAUTH_SECRET=${NEXTAUTH_SECRET} \
      --from-literal=NEXTAUTH_URL='http://localhost:3000' \
      --from-literal=DATABASE_URL='postgresql://user:password@postgres:5432/curasense' \
      --from-literal=GEMINI_API_KEY='your-gemini-api-key' \
      --from-literal=HUGGINGFACE_API_KEY='your-huggingface-api-key' \
      --from-literal=DB_USER='curasense' \
      --from-literal=DB_PASSWORD='secure-password' \
      -n curasense --dry-run=client -o yaml | kubectl apply -f -
    
    log_success "Secrets created"
}

deploy_infrastructure() {
    log_info "Deploying infrastructure..."
    
    kubectl apply -f k8s/infrastructure/config.yaml
    kubectl apply -f k8s/infrastructure/ingress.yaml
    
    log_success "Infrastructure deployed"
}

deploy_services() {
    log_info "Deploying services..."
    
    kubectl apply -f k8s/frontend/frontend-deployment.yaml
    kubectl apply -f k8s/backend-ml/ml-deployment-complete.yaml
    kubectl apply -f k8s/backend-vision/vision-deployment-complete.yaml
    
    log_success "Services deployed"
}

wait_for_deployment() {
    log_info "Waiting for deployments to be ready..."
    
    kubectl wait --for=condition=available --timeout=300s \
      deployment/curasense-frontend -n curasense || true
    kubectl wait --for=condition=available --timeout=300s \
      deployment/curasense-ml -n curasense || true
    kubectl wait --for=condition=available --timeout=300s \
      deployment/curasense-vision -n curasense || true
    
    log_success "Deployments are ready"
}

show_status() {
    log_info "Deployment status:"
    echo ""
    kubectl get all -n curasense
    echo ""
    log_info "Service URLs:"
    INGRESS_IP=$(kubectl get ingress curasense-ingress -n curasense -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")
    echo "  Frontend: http://${INGRESS_IP}"
    echo "  API: http://${INGRESS_IP}/api"
    echo ""
    log_info "Port forwarding (for local testing):"
    echo "  Frontend: kubectl port-forward svc/curasense-frontend-service 3000:80 -n curasense"
    echo "  ML API: kubectl port-forward svc/curasense-ml-service 8000:8000 -n curasense"
    echo "  Vision API: kubectl port-forward svc/curasense-vision-service 8001:8001 -n curasense"
}

# Main flow
main() {
    log_info "Starting CuraSense Kubernetes deployment..."
    echo ""
    
    REGISTRY=${1:-"curasense"}
    SKIP_BUILD=${2:-"false"}
    
    log_info "Configuration:"
    echo "  Registry: ${REGISTRY}"
    echo "  Skip build: ${SKIP_BUILD}"
    echo ""
    
    check_prerequisites
    
    if [ "${SKIP_BUILD}" != "true" ]; then
        build_images ${REGISTRY}
        push_images ${REGISTRY}
    fi
    
    update_manifests ${REGISTRY}
    create_namespace
    create_secrets
    deploy_infrastructure
    deploy_services
    wait_for_deployment
    show_status
    
    log_success "Deployment completed successfully!"
}

# Run main function
main "$@"
