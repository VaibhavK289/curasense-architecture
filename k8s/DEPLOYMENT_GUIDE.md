# ============================================
# CURASENSE KUBERNETES DEPLOYMENT GUIDE
# ============================================

## Prerequisites

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl && sudo mv kubectl /usr/local/bin/

# Install Helm (optional but recommended)
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Setup kubeconfig for your cluster
# For EKS: aws eks update-kubeconfig --name cluster-name --region region
# For GKE: gcloud container clusters get-credentials cluster-name
# For AKS: az aks get-credentials --resource-group rg-name --name cluster-name
```

## Deployment Steps

### 1. Create Namespace and ConfigMaps/Secrets

```bash
# Apply the complete Kubernetes manifest
kubectl apply -f k8s/curasense-complete.yaml

# Verify namespace creation
kubectl get namespace curasense

# Verify ConfigMap
kubectl get configmap -n curasense
kubectl describe configmap curasense-config -n curasense

# Verify Secrets
kubectl get secrets -n curasense
```

### 2. Build and Push Docker Images

```bash
# For Docker Hub
docker build -t yourusername/curasense-frontend:latest curasense-frontend/
docker build -t yourusername/curasense-backend-ml:latest ml-fastapi/
docker build -t yourusername/curasense-backend-vision:latest ml-fastapi/

docker push yourusername/curasense-frontend:latest
docker push yourusername/curasense-backend-ml:latest
docker push yourusername/curasense-backend-vision:latest

# Update image references in curasense-complete.yaml
sed -i 's|curasense-frontend:latest|yourusername/curasense-frontend:latest|g' k8s/curasense-complete.yaml
sed -i 's|curasense-backend-ml:latest|yourusername/curasense-backend-ml:latest|g' k8s/curasense-complete.yaml
sed -i 's|curasense-backend-vision:latest|yourusername/curasense-backend-vision:latest|g' k8s/curasense-complete.yaml
```

### 3. Configure Secrets with Actual Values

```bash
# Create secrets from files (recommended approach)
kubectl create secret generic curasense-secrets \
  --from-literal=NEXTAUTH_SECRET=$(openssl rand -hex 32) \
  --from-literal=GEMINI_API_KEY='your-actual-key' \
  --from-literal=HUGGINGFACE_API_KEY='your-actual-key' \
  --from-literal=DATABASE_URL='postgresql://user:password@postgres:5432/curasense' \
  -n curasense --dry-run=client -o yaml | kubectl apply -f -
```

### 4. Deploy NGINX Ingress Controller (if not already installed)

```bash
# Add Helm repo
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install NGINX Ingress Controller
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer
```

### 5. Install Cert-Manager (for TLS/SSL)

```bash
# Add Helm repo
helm repo add jetstack https://charts.jetstack.io
helm repo update

# Install cert-manager
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true

# Create ClusterIssuer for Let's Encrypt
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@curasense.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### 6. Deploy PostgreSQL Database (Optional - if using Kubernetes)

```bash
# Add Helm repo
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Install PostgreSQL
helm install postgres bitnami/postgresql \
  --namespace curasense \
  --set auth.password='your-secure-password' \
  --set persistence.size=10Gi \
  --set metrics.enabled=true
```

### 7. Verify Deployments

```bash
# Check all resources
kubectl get all -n curasense

# Check specific deployments
kubectl get deployments -n curasense
kubectl get services -n curasense
kubectl get pods -n curasense

# Check HPA status
kubectl get hpa -n curasense

# Describe a specific deployment for issues
kubectl describe deployment curasense-frontend -n curasense

# View logs
kubectl logs -f deployment/curasense-frontend -n curasense
kubectl logs -f deployment/curasense-ml -n curasense
kubectl logs -f deployment/curasense-vision -n curasense
```

### 8. Monitor and Debug

```bash
# Watch pod status
kubectl get pods -n curasense -w

# Check events
kubectl get events -n curasense --sort-by='.lastTimestamp'

# Access pod shell
kubectl exec -it deployment/curasense-frontend -n curasense -- sh

# Port-forward for local testing
kubectl port-forward svc/curasense-frontend-service 3000:80 -n curasense
kubectl port-forward svc/curasense-ml-service 8000:8000 -n curasense
```

## Production Checklist

- [ ] Update image pull secrets for private registries
- [ ] Set resource requests/limits based on your cluster capacity
- [ ] Update NEXTAUTH_SECRET with a secure random value
- [ ] Configure actual database credentials
- [ ] Set up external PostgreSQL or use managed database service
- [ ] Update domain name in Ingress configuration
- [ ] Enable network policies for security
- [ ] Set up monitoring with Prometheus/Grafana
- [ ] Configure backup strategy for PersistentVolumes
- [ ] Set up CI/CD pipeline for automated deployments
- [ ] Enable pod security policies
- [ ] Configure resource quotas per namespace
- [ ] Set up AlertManager for critical issues

## Scaling Configuration

Adjust replica counts and HPA limits based on your needs:

```yaml
# Frontend scaling
minReplicas: 3  # Minimum running replicas
maxReplicas: 10 # Maximum during high load

# ML Backend scaling
minReplicas: 2
maxReplicas: 8

# Vision Backend scaling
minReplicas: 2
maxReplicas: 6
```

## Useful Commands

```bash
# Update deployment with new image
kubectl set image deployment/curasense-frontend \
  frontend=yourusername/curasense-frontend:v2 \
  -n curasense

# Scale deployment manually
kubectl scale deployment curasense-frontend --replicas=5 -n curasense

# Rollback to previous version
kubectl rollout undo deployment/curasense-frontend -n curasense

# Delete entire deployment
kubectl delete -f k8s/curasense-complete.yaml

# Export current config
kubectl get all -n curasense -o yaml > backup.yaml

# View resource usage
kubectl top nodes
kubectl top pods -n curasense
```

## Troubleshooting

### Pods not starting?
```bash
kubectl describe pod <pod-name> -n curasense
kubectl logs <pod-name> -n curasense
```

### Image pull errors?
```bash
# Check if image exists and credentials are correct
kubectl describe pod <pod-name> -n curasense | grep -A 5 "Events:"
```

### Service connectivity issues?
```bash
# Test DNS resolution from pod
kubectl exec -it <pod-name> -n curasense -- nslookup curasense-ml-service

# Check service endpoints
kubectl get endpoints -n curasense
```

### Persistent volume not mounting?
```bash
# Check PVC status
kubectl get pvc -n curasense
kubectl describe pvc curasense-models-pvc -n curasense
```
