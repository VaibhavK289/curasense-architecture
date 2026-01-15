# Kubernetes Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Automated deployment
chmod +x k8s/deploy.sh && ./k8s/deploy.sh

# Manual deployment
kubectl apply -f k8s/curasense-complete.yaml

# With custom registry
./k8s/deploy.sh "docker.io/myusername"
```

## 📊 Monitoring Commands

```bash
# Check all resources
kubectl get all -n curasense

# Watch deployments
kubectl get deployments -n curasense -w

# Check HPA status
kubectl get hpa -n curasense

# View events
kubectl get events -n curasense --sort-by='.lastTimestamp'

# Pod resources
kubectl top pods -n curasense

# Node resources
kubectl top nodes
```

## 🔍 Debugging Commands

```bash
# Describe deployment
kubectl describe deployment curasense-frontend -n curasense

# View logs
kubectl logs deployment/curasense-frontend -n curasense

# Follow logs
kubectl logs -f deployment/curasense-ml -n curasense

# Last 100 lines
kubectl logs --tail=100 deployment/curasense-vision -n curasense

# Pod shell
kubectl exec -it deployment/curasense-frontend -n curasense -- sh

# Test connectivity
kubectl run -it --rm test --image=curlimages/curl --restart=Never -- sh
```

## 🔄 Update Commands

```bash
# Update image
kubectl set image deployment/curasense-frontend \
  frontend=registry/curasense-frontend:v2 -n curasense

# Scale manually
kubectl scale deployment curasense-frontend --replicas=5 -n curasense

# Rollback
kubectl rollout undo deployment/curasense-frontend -n curasense

# Rollout history
kubectl rollout history deployment/curasense-frontend -n curasense
```

## 🌐 Port Forward Commands

```bash
# Frontend
kubectl port-forward svc/curasense-frontend-service 3000:80 -n curasense

# ML API
kubectl port-forward svc/curasense-ml-service 8000:8000 -n curasense

# Vision API
kubectl port-forward svc/curasense-vision-service 8001:8001 -n curasense
```

## 🔐 Secrets & Config Commands

```bash
# View ConfigMap
kubectl get configmap curasense-config -n curasense

# Edit ConfigMap
kubectl edit configmap curasense-config -n curasense

# View Secrets
kubectl get secrets -n curasense

# Edit Secrets
kubectl edit secret curasense-secrets -n curasense

# Create Secret
kubectl create secret generic curasense-secrets \
  --from-literal=KEY=value -n curasense --dry-run=client -o yaml | kubectl apply -f -
```

## 💾 Storage Commands

```bash
# List PVC
kubectl get pvc -n curasense

# Describe PVC
kubectl describe pvc curasense-models-pvc -n curasense

# Resize PVC
kubectl patch pvc curasense-models-pvc -p '{"spec":{"resources":{"requests":{"storage":"30Gi"}}}}' -n curasense
```

## 🧹 Cleanup Commands

```bash
# Delete entire deployment
kubectl delete -f k8s/curasense-complete.yaml

# Delete namespace (all resources)
kubectl delete namespace curasense

# Delete specific deployment
kubectl delete deployment curasense-frontend -n curasense

# Delete service
kubectl delete svc curasense-ml-service -n curasense
```

## 📈 Performance Tuning

```yaml
# Check current resource requests
kubectl describe nodes

# Check cluster capacity
kubectl cluster-info dump

# Check resource quotas
kubectl describe resourcequota -n curasense

# Check limit ranges
kubectl describe limitrange -n curasense
```

## 🔥 Troubleshooting Quick Fixes

```bash
# Pod stuck in Pending?
kubectl describe pod <pod-name> -n curasense
# Check resource availability: kubectl describe nodes

# Pod crashes?
kubectl logs <pod-name> -n curasense
# Check exit code: kubectl get pod <pod-name> -o yaml

# Service not accessible?
kubectl get endpoints -n curasense
# Test DNS: kubectl exec -it <pod> -- nslookup service-name

# Image pull errors?
kubectl describe pod <pod-name> | grep -A 5 "image pull"
# May need: kubectl create secret docker-registry regcred ...

# HPA not working?
kubectl describe hpa <hpa-name> -n curasense
# Check metrics: kubectl top pods -n curasense
```

## 📋 Useful Aliases

Add these to your `.bashrc` or `.zshrc`:

```bash
alias k='kubectl'
alias kn='kubectl config set-context --current --namespace'
alias kg='kubectl get'
alias kd='kubectl describe'
alias kl='kubectl logs'
alias kex='kubectl exec -it'
alias kaf='kubectl apply -f'
alias kdel='kubectl delete'
alias kgpw='kubectl get pods -w'
alias kgn='kubectl get nodes'
alias kgs='kubectl get services'

# Alias for curasense namespace
alias kc='kubectl -n curasense'
```

## 🎯 Common Workflows

### Deploy New Version
```bash
docker build -t registry/curasense-frontend:v2 curasense-frontend/
docker push registry/curasense-frontend:v2
kubectl set image deployment/curasense-frontend \
  frontend=registry/curasense-frontend:v2 -n curasense
kubectl rollout status deployment/curasense-frontend -n curasense
```

### Scale Down for Maintenance
```bash
kubectl scale deployment curasense-frontend --replicas=0 -n curasense
kubectl scale deployment curasense-ml --replicas=0 -n curasense
kubectl scale deployment curasense-vision --replicas=0 -n curasense
```

### Scale Up After Maintenance
```bash
kubectl scale deployment curasense-frontend --replicas=3 -n curasense
kubectl scale deployment curasense-ml --replicas=2 -n curasense
kubectl scale deployment curasense-vision --replicas=2 -n curasense
```

### Full Backup
```bash
kubectl get all -n curasense -o yaml > backup-all.yaml
kubectl get pvc -n curasense -o yaml > backup-pvc.yaml
kubectl get configmap -n curasense -o yaml > backup-configmap.yaml
kubectl get secret -n curasense -o yaml > backup-secrets.yaml
```

### Full Restore
```bash
kubectl apply -f backup-all.yaml
kubectl apply -f backup-pvc.yaml
kubectl apply -f backup-configmap.yaml
kubectl apply -f backup-secrets.yaml
```

## 🔗 Useful Resources

| Resource | Link |
|----------|------|
| Kubectl Cheatsheet | https://kubernetes.io/docs/reference/kubectl/cheatsheet/ |
| API Reference | https://kubernetes.io/docs/reference/kubernetes-api/ |
| Best Practices | https://kubernetes.io/docs/concepts/configuration/overview/ |
| Troubleshooting | https://kubernetes.io/docs/tasks/debug-application-cluster/ |

## 💡 Pro Tips

1. **Use `-o wide`** for more details: `kubectl get pods -o wide -n curasense`
2. **Use `-o yaml`** to see full details: `kubectl describe pod <pod> -o yaml -n curasense`
3. **Use `--watch`** for real-time updates: `kubectl get pods --watch -n curasense`
4. **Use `--all-namespaces`** to see everything: `kubectl get pods --all-namespaces`
5. **Use `--sort-by`** to sort results: `kubectl get events --sort-by='.lastTimestamp' -n curasense`
6. **Create aliases** for common commands
7. **Use `kubectx`** for fast namespace switching
8. **Use `k9s`** for terminal UI management

---

**Last Updated**: January 2026
**Kubernetes Version**: 1.20+
**CuraSense Version**: V4.0
