# CuraSense Kubernetes Deployment

Complete production-ready Kubernetes manifests for deploying CuraSense across multiple services.

## 📋 Overview

This directory contains Kubernetes manifests for deploying CuraSense with:
- **3 microservices**: Frontend, ML Backend, Vision Backend
- **Auto-scaling**: HorizontalPodAutoscaler for each service
- **High availability**: Multiple replicas with pod disruption budgets
- **Security**: RBAC, network policies, security contexts
- **Monitoring**: Resource limits, health checks, logging
- **Networking**: Ingress with TLS/SSL support
- **Storage**: Persistent volumes for models and database

## 📁 Directory Structure

```
k8s/
├── curasense-complete.yaml          # All-in-one deployment file
├── deploy.sh                         # Automated deployment script
├── DEPLOYMENT_GUIDE.md               # Detailed deployment instructions
├── README.md                         # This file
├── frontend/
│   └── frontend-deployment.yaml     # Frontend service manifests
├── backend-ml/
│   └── ml-deployment-complete.yaml  # ML backend service manifests
├── backend-vision/
│   └── vision-deployment-complete.yaml # Vision backend service manifests
└── infrastructure/
    ├── config.yaml                  # ConfigMaps, Secrets, PVCs, RBAC
    └── ingress.yaml                 # Ingress, TLS, Network Policies
```

## 🚀 Quick Start

### Option 1: Automated Deployment (Recommended)

```bash
# Make script executable
chmod +x k8s/deploy.sh

# Deploy to local Kubernetes (Minikube/Docker Desktop)
./k8s/deploy.sh

# Deploy to registry (e.g., Docker Hub)
./k8s/deploy.sh "docker.io/yourusername"

# Skip image building (use pre-built images)
./k8s/deploy.sh "curasense" true
```

### Option 2: Manual Deployment

```bash
# 1. Create namespace
kubectl create namespace curasense

# 2. Create secrets
kubectl create secret generic curasense-secrets \
  --from-literal=NEXTAUTH_SECRET=$(openssl rand -hex 32) \
  --from-literal=GEMINI_API_KEY='your-key' \
  -n curasense

# 3. Deploy infrastructure
kubectl apply -f k8s/infrastructure/config.yaml
kubectl apply -f k8s/infrastructure/ingress.yaml

# 4. Deploy services
kubectl apply -f k8s/frontend/frontend-deployment.yaml
kubectl apply -f k8s/backend-ml/ml-deployment-complete.yaml
kubectl apply -f k8s/backend-vision/vision-deployment-complete.yaml

# 5. Monitor deployment
kubectl get pods -n curasense -w
```

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Ingress (Nginx)                         │
│                  curasense.example.com                      │
└─────────────────────────────────────────────────────────────┘
                    ↓
        ┌───────────┼───────────┐
        ↓           ↓           ↓
    ┌──────┐   ┌──────┐   ┌──────────┐
    │Front │   │  ML  │   │ Vision   │
    │ end  │   │ API  │   │   API    │
    └──────┘   └──────┘   └──────────┘
       ↓           ↓           ↓
   (3 pods)   (2-8 pods) (2-6 pods)
              HPA enabled HPA enabled
```

## 🔧 Configuration

### Resource Allocation

Each service has defined resource requests and limits:

```yaml
Resources:
  Frontend:
    Requests: CPU 250m, Memory 512Mi
    Limits: CPU 500m, Memory 1Gi
  
  ML Backend:
    Requests: CPU 500m, Memory 1Gi
    Limits: CPU 2000m, Memory 3Gi
  
  Vision Backend:
    Requests: CPU 1000m, Memory 2Gi
    Limits: CPU 3000m, Memory 4Gi
```

### Auto-Scaling

```yaml
Frontend HPA:
  Min Replicas: 3
  Max Replicas: 10
  CPU Target: 70%
  Memory Target: 80%

ML Backend HPA:
  Min Replicas: 2
  Max Replicas: 8
  CPU Target: 75%
  Memory Target: 85%

Vision Backend HPA:
  Min Replicas: 2
  Max Replicas: 6
  CPU Target: 75%
  Memory Target: 85%
```

## 🔒 Security Features

### RBAC (Role-Based Access Control)
- ServiceAccount with limited permissions
- Only access to ConfigMaps and Secrets needed

### Network Policies
- Internal service-to-service communication allowed
- Ingress traffic from nginx-ingress namespace
- Egress to DNS, HTTPS, and PostgreSQL

### Security Contexts
- Non-root user execution
- Read-only root filesystem (where applicable)
- No privilege escalation
- Dropped capabilities

### Pod Disruption Budgets
- Frontend: Minimum 2 available replicas
- ML Backend: Minimum 1 available replica
- Vision Backend: Minimum 1 available replica

## 📝 Environment Variables

### Configure in ConfigMap

```bash
kubectl edit configmap curasense-config -n curasense
```

Key variables:
- `NODE_ENV`: production
- `NEXT_PUBLIC_API_TIMEOUT`: 30000
- `LOG_LEVEL`: INFO
- `WORKERS`: 4
- `MODEL_CACHE_DIR`: /app/models

### Configure in Secrets

```bash
kubectl edit secret curasense-secrets -n curasense
```

Key secrets:
- `NEXTAUTH_SECRET`: Auto-generated (change in production)
- `GEMINI_API_KEY`: Your Gemini API key
- `HUGGINGFACE_API_KEY`: Your HuggingFace key
- `DATABASE_URL`: PostgreSQL connection string

## 🌐 Networking

### Ingress Configuration

The Ingress routes traffic as follows:
- `/` → Frontend (port 80)
- `/api/diagnose` → ML API (port 8000)
- `/vision` → Vision API (port 8001)

### Service Discovery

Services are accessible via DNS:
- `curasense-frontend-service.curasense.svc.cluster.local:80`
- `curasense-ml-service.curasense.svc.cluster.local:8000`
- `curasense-vision-service.curasense.svc.cluster.local:8001`

### Port Forwarding (Local Development)

```bash
# Frontend
kubectl port-forward svc/curasense-frontend-service 3000:80 -n curasense

# ML API
kubectl port-forward svc/curasense-ml-service 8000:8000 -n curasense

# Vision API
kubectl port-forward svc/curasense-vision-service 8001:8001 -n curasense
```

## 📦 Storage

### Persistent Volumes

- **Models**: 20Gi for ML models and cache
- **Database**: 10Gi for PostgreSQL data

```bash
# Check PVC status
kubectl get pvc -n curasense

# Resize PVC (if needed)
kubectl patch pvc curasense-models-pvc -p '{"spec":{"resources":{"requests":{"storage":"30Gi"}}}}' -n curasense
```

## 🔍 Monitoring & Debugging

### Check Deployment Status

```bash
# All resources
kubectl get all -n curasense

# Specific deployments
kubectl get deployments -n curasense
kubectl describe deployment curasense-frontend -n curasense

# Pod status
kubectl get pods -n curasense -o wide
```

### View Logs

```bash
# Frontend logs
kubectl logs -f deployment/curasense-frontend -n curasense

# ML API logs
kubectl logs -f deployment/curasense-ml -n curasense

# Specific pod
kubectl logs -f <pod-name> -n curasense

# Last 100 lines
kubectl logs -f --tail=100 deployment/curasense-frontend -n curasense
```

### Access Pod Shell

```bash
kubectl exec -it deployment/curasense-frontend -n curasense -- sh
```

### Check Resources

```bash
# Node resources
kubectl top nodes

# Pod resources
kubectl top pods -n curasense

# Detailed resource usage
kubectl get pods -n curasense -o custom-columns=NAME:.metadata.name,CPU:.spec.containers[*].resources.requests.cpu,MEM:.spec.containers[*].resources.requests.memory
```

### Events

```bash
# Recent events
kubectl get events -n curasense --sort-by='.lastTimestamp'

# Watch events
kubectl get events -n curasense -w
```

## 🔄 Updates & Rollouts

### Update Image

```bash
kubectl set image deployment/curasense-frontend \
  frontend=curasense-frontend:v2 \
  -n curasense

# With rollout monitoring
kubectl rollout status deployment/curasense-frontend -n curasense
```

### Check Rollout History

```bash
kubectl rollout history deployment/curasense-frontend -n curasense
```

### Rollback

```bash
# To previous version
kubectl rollout undo deployment/curasense-frontend -n curasense

# To specific revision
kubectl rollout undo deployment/curasense-frontend --to-revision=2 -n curasense
```

## 🧹 Cleanup

```bash
# Delete entire deployment
kubectl delete -f k8s/curasense-complete.yaml

# Or delete namespace (removes all resources)
kubectl delete namespace curasense

# Delete specific resource
kubectl delete deployment curasense-frontend -n curasense
kubectl delete service curasense-ml-service -n curasense
```

## 📊 Production Checklist

- [ ] Update image registry to your container registry
- [ ] Generate and secure NEXTAUTH_SECRET
- [ ] Configure actual database connection string
- [ ] Set up PostgreSQL (managed service recommended)
- [ ] Configure external secrets management (Vault, AWS Secrets Manager)
- [ ] Update domain name in Ingress
- [ ] Set up SSL/TLS certificates
- [ ] Configure monitoring and alerting
- [ ] Set up logging (ELK, Datadog, CloudWatch)
- [ ] Enable backup for PersistentVolumes
- [ ] Configure resource quotas for namespace
- [ ] Set up pod security policies
- [ ] Enable audit logging
- [ ] Configure node affinity and topology spread
- [ ] Set up disaster recovery plan

## 🆘 Troubleshooting

### Pods not starting?

```bash
kubectl describe pod <pod-name> -n curasense
kubectl logs <pod-name> -n curasense
```

### Image pull errors?

```bash
# Check image availability
docker images | grep curasense

# Check image secrets
kubectl get secrets -n curasense

# May need to create image pull secret
kubectl create secret docker-registry regcred \
  --docker-server=docker.io \
  --docker-username=<username> \
  --docker-password=<password> \
  -n curasense
```

### Service connectivity issues?

```bash
# Test DNS from pod
kubectl exec -it <pod-name> -n curasense -- nslookup curasense-ml-service

# Check endpoints
kubectl get endpoints -n curasense

# Test service connectivity
kubectl run -it --rm debug --image=curosaurus/curl --restart=Never -- sh
# Inside pod: curl http://curasense-ml-service:8000/health
```

### Storage issues?

```bash
# Check PVC
kubectl describe pvc curasense-models-pvc -n curasense

# Check PV
kubectl get pv

# Check storage class
kubectl get storageclass
```

## 📚 References

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Charts](https://helm.sh/)
- [Cert-Manager](https://cert-manager.io/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [PostgreSQL Operator](https://github.com/zalando/postgres-operator)

## 📄 License

Same as main CuraSense project.

## ✉️ Support

For issues or questions, please refer to the main project repository.
