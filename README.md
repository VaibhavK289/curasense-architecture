# Curasense Diagnosis ML Model

## Overview
This project provides a modular, containerized machine learning diagnosis system using Docker and Kubernetes. It includes backend ML services, a frontend dashboard, and deployment scripts for local and cloud environments.

## Project Structure
```
curasense_diagnosis_ml_model/
├── compose.yaml
├── README.Docker.md
├── start_servers.bat
├── curasense-ml/
│   ├── app.py
│   ├── Dockerfile
│   ├── flow.py
│   ├── ...
│   ├── frontend/
│   │   ├── dashboard.html
│   │   ├── dashboard.js
│   │   └── ...
│   └── src/
│       ├── hugging_face_ner.py
│       ├── ...
│       └── crew/
├── k8s/
│   ├── backend-ml/
│   │   └── ml-deployment.yaml
│   ├── backend-vision/
│   │   └── vision-deployment.yaml
│   └── frontend/
├── ml-fastapi/
│   ├── main.py
│   ├── Dockerfile
│   ├── ...
│   └── config/
│       ├── credentials.py
│       └── ...
```

## Features
- Modular ML backend (FastAPI, Python)
- Frontend dashboard (HTML/CSS/JS)
- Dockerized microservices
- Kubernetes deployment manifests
- Support for local (Minikube) and cloud clusters

## Prerequisites
- Docker
- Kubernetes (Minikube or cloud provider)
- kubectl
- Python 3.8+

## Setup Instructions

### 1. Build Docker Images
Navigate to each service directory and build images:
```sh
cd curasense-ml
docker build -t curasense-ml:latest .
cd ../ml-fastapi
docker build -t ml-fastapi:latest .
```

### 2. Push Images to Registry (if needed)
Tag and push images to your registry:
```sh
docker tag curasense-ml:latest <your-registry>/curasense-ml:latest
docker push <your-registry>/curasense-ml:latest
# Repeat for ml-fastapi
```

### 3. Configure Kubernetes Manifests
- Edit `k8s/backend-ml/ml-deployment.yaml` and `k8s/backend-vision/vision-deployment.yaml` to use the correct image names/tags.
- Set resource requests/limits and environment variables as needed.

### 4. Deploy to Kubernetes
Apply manifests:
```sh
kubectl apply -f k8s/backend-ml/ml-deployment.yaml
kubectl apply -f k8s/backend-vision/vision-deployment.yaml
# Apply frontend and other manifests as needed
```

### 5. Verify Deployment
Check pod and service status:
```sh
kubectl get pods
kubectl get services
```

### 6. Access the Application
- For Minikube: `minikube service <service-name>`
- For cloud: Use the external IP or Ingress as configured.

## Development
- Backend code: `curasense-ml/`, `ml-fastapi/`
- Frontend code: `curasense-ml/frontend/`
- Configuration: `curasense-ml/crew/config/`, `ml-fastapi/config/`

## Testing
- Unit tests can be added in each service directory.
- To test API endpoints, use tools like Postman or curl.

## Troubleshooting
- Check logs: `kubectl logs <pod-name>`
- Describe resources: `kubectl describe pod <pod-name>`
- Ensure images are accessible by the cluster.

## Security & Best Practices
- Use Kubernetes Secrets for sensitive data.
- Set resource limits for all containers.
- Add liveness/readiness probes in deployments.
- Regularly update dependencies.

## License
See individual LICENSE files in each service directory.

## Authors
- Curasense Team

## Acknowledgements
- Open source ML libraries
- Kubernetes and Docker communities
