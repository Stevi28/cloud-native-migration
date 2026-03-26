# Cloud-Native Envoy Migration: From Monolith to Kubernetes

This project demonstrates a professional DevOps workflow, transitioning a Node.js application to a modern, scalable, and secure Cloud-Native architecture using Envoy Proxy and Kubernetes.

##  Project Milestones

1. **Modern Edge Proxy (Envoy)**: Replaced traditional NGINX with **Envoy Proxy (v1.28)** to align with the new **Kubernetes Gateway API** standards (post-NGINX Ingress retirement).
2. **Containerization (Docker)**: Solved the "Matrix from Hell" by bundling a Node.js app with its dependencies (Express, MongoDB client, Redis client) using a shared kernel architecture.
3. **Orchestration (Docker Compose)**: Managed a multi-container production-ready stack including Node.js, MongoDB, and Redis, isolated behind the Envoy Gateway — with healthchecks ensuring correct startup order.
4. **Infrastructure as Code (Scripts)**: Automated the Docker and containerd installation process on Ubuntu VMs, with architecture detection for arm64/amd64. Tested on Ubuntu 24.04 LTS.
5. **Kubernetes Architecture**: Implemented a High Availability (HA) deployment with 3 replicas, self-healing capabilities, and zero-downtime rolling updates.
6. **Envoy on Kubernetes**: Deployed Envoy Proxy as a K8s Deployment with a ConfigMap-mounted configuration and NodePort Service — mirroring the Docker Compose setup inside the cluster.
7. **Kubernetes Secrets**: DB connection URLs are injected via base64-encoded Kubernetes Secrets — never hardcoded in the codebase or committed to the repository.
8. **MongoDB Persistence**: Added a PersistentVolumeClaim to ensure MongoDB data survives pod restarts in Kubernetes.
9. **Ingress & Service Architecture**: Explicit ClusterIP Service for the Node.js app (internal only) and a formal Ingress resource declaring Envoy as the cluster entry point.
10. **CI/CD Pipeline**: GitHub Actions automatically builds and pushes the Docker image to Docker Hub on every push to `main`.
11. **Runtime Standards (CRI & OCI)**: Documented the transition from Docker Shim to **containerd** using the Container Runtime Interface.
12. **Clean Architecture (.gitignore)**: Implemented Git standards to exclude local dependencies, OS-specific files, `.env`, and `k8s/secrets.yaml` — keeping the repository secure and lightweight.
13. **Runtime Evolution (CRI)**: Added automated scripts for standalone **containerd** installation, moving away from Docker Shim as per modern Kubernetes requirements.

##  Architecture Diagram
```text
                      [ Public Internet ]
                              |
                              v
                    +-----------------------+
                    |      Envoy Proxy      |  <-- Edge Gateway (Port 80)
                    |    (Future-Proof)     |
                    +-----------------------+
                              |
            +-----------------+-----------------+
            |                                   |
            v                                   v
    +----------------+                  +----------------+
    |   Node.js App  |                  |  Envoy Admin   |
    |   (Port 3000)  |                  |  (Port 9901)   |
    +----------------+                  +----------------+
            |
      +-----+-----+
      |           |
      v           v
  [MongoDB]    [Redis]
  (PVC-backed)
```

> This architecture is identical across both environments — Docker Compose for local dev, Kubernetes for production.

## Tech Stack & Tools
- **Proxy/Gateway**: Envoy Proxy v1.28
- **Runtime**: Node.js 18 (Alpine)
- **Container Engine**: Docker / containerd (CRI-compatible)
- **Orchestrator**: Kubernetes (K8s) via Minikube
- **Registry**: Docker Hub (via GitHub Actions CI)
- **CLI Tools**: `docker`, `kubectl`, `crictl`, `nerdctl`

##  Project Structure
- `/app`: Source code and package definitions.
- `/envoy`: Envoy Proxy configuration (used by Docker Compose).
- `/k8s`: Kubernetes manifests (Deployment, Services, ConfigMap, Secrets, PVC).
- `/scripts`: Bash scripts for environment automation.
- `/docs`: Technical deep-dives into CRI and CLI tooling.
- `.env.example`: Documents required environment variables without exposing values.
- `.gitignore`: Rules for excluding non-essential and sensitive files.

## Key Concepts Covered
- **Control Plane vs. Worker Nodes**: Understanding the separation of management and execution layers.
- **etcd Consistency & Scheduler Logic**: How K8s maintains state and decides where to place Pods.
- **OCI Image Specifications**: Building standard-compliant images for any container runtime.
- **Self-healing via Replicas**: Ensuring high availability through automated pod recovery.
- **Zero-Downtime Rolling Updates**: Observed live as old pods terminated one-by-one while new ones came up.
- **DB Connectivity Checks**: The root endpoint (`/`) actively pings MongoDB and Redis on each request, reporting live connection status for both databases.
- **Cross-Architecture Scripting**: Automated scripts detect the host architecture (`arm64`/`amd64`) at runtime and download the correct binaries.
- **Secrets Management**: DB URLs injected via Kubernetes Secrets and local `.env` file — never hardcoded or committed to the repository.
- **Data Persistence**: MongoDB data persisted via a PersistentVolumeClaim, surviving pod restarts.
- **Healthcheck-driven Startup**: Docker Compose services start only after their dependencies pass healthchecks, eliminating race conditions.

## CI/CD Pipeline

GitHub Actions automatically builds and pushes the Docker image to Docker Hub on every push to `main`.
```yaml
on:
  push:
    branches:
      - main
```

> ⚠️ **Note on the deploy step**: The pipeline covers the **build and push** stages only. The automated deploy step was intentionally omitted because this project runs on **Minikube** — a local Kubernetes cluster that is not reachable from GitHub Actions runners. Deploying to a real cluster (EKS, GKE, AKS) would enable a full build → push → deploy pipeline. For the scope of this project, the image is available on Docker Hub and deployment is performed locally via `kubectl apply -f k8s/`.

## Environment Variables

Before running, create a `.env` file in the root directory based on `.env.example`:
```
MONGO_URL=
REDIS_URL=
```

For Kubernetes, create `k8s/secrets.yaml` with base64-encoded values:
```bash
echo -n "your-mongo-url" | base64
echo -n "your-redis-url" | base64
```

> ⚠️ Neither `.env` nor `k8s/secrets.yaml` are committed to the repository — they must be created locally before running the app.

## Quick Start & Execution

Follow these steps to run the environment locally on your machine.

### Prerequisites
- **Docker & Docker Compose** installed.
- **Minikube** (for the Kubernetes part).

### 1. Run with Docker Compose (Local Dev)
This setup spins up the Node.js app, MongoDB, Redis, and the **Envoy Proxy** as the entry point. Services start only after their dependencies pass healthchecks.
```bash
# Create your .env file first
cp .env.example .env
# Fill in the values in .env

# Build and start all containers
docker-compose up --build -d

# Check if everything is running
docker-compose ps
```

**App URL**: http://localhost  
**Envoy Admin**: http://localhost:9901

### 2. Run on Kubernetes (Minikube)

#### First-time setup — build the image inside Minikube's Docker daemon:
```bash
# Point Docker CLI to Minikube's internal daemon
eval $(minikube docker-env)

# Build the image where Minikube can find it
docker build -t node-app:latest .
```

#### Create the secrets file locally:
```bash
# Generate base64 values
echo -n "mongodb://mongodb:27017" | base64
echo -n "redis://redis-cache:6379" | base64

# Create k8s/secrets.yaml with the output values (see format in docs)
```

#### Deploy the full stack:
```bash
# Start Minikube
minikube start

# Apply all manifests (app, mongodb, redis, envoy, pvc, secrets)
kubectl apply -f k8s/

# Verify all pods are Running
kubectl get pods -w
```

#### Access the app:
```bash
minikube service envoy-proxy
```

> ⚠️ On macOS with the Docker driver, Minikube creates a localhost tunnel. **Keep that terminal open** — closing it stops the tunnel and the app becomes unreachable.

**App URL**: provided by `minikube service envoy-proxy` (e.g. `http://127.0.0.1:XXXXX`)  
**Envoy Admin**: second URL provided by the same command

#### After updating the app image:
```bash
eval $(minikube docker-env)
docker build -t node-app:latest .
kubectl rollout restart deployment/cloud-native-app
```

### 3. Run the Automation Scripts (Ubuntu VMs)
To set up a fresh Ubuntu server as a Docker or containerd host:
```bash
# Install Docker
chmod +x scripts/install-docker.sh
./scripts/install-docker.sh

# Install standalone containerd (CRI-compliant, arch-aware)
chmod +x scripts/setup-containerd.sh
./scripts/setup-containerd.sh
```

> Both scripts are tested on Ubuntu 24.04 LTS (arm64 & amd64).

### 4. Cleanup
To stop everything and free up system resources:
```bash
# Docker Compose
docker-compose down

# Kubernetes
kubectl delete -f k8s/
minikube stop
```