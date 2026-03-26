# Cloud-Native Envoy Migration: From Monolith to Kubernetes

This project demonstrates a professional DevOps workflow, transitioning a Node.js application to a modern, scalable, and secure Cloud-Native architecture using Envoy Proxy and Kubernetes.

##  Project Milestones

1. **Modern Edge Proxy (Envoy)**: Replaced traditional NGINX with **Envoy Proxy (v1.28)** to align with the new **Kubernetes Gateway API** standards (post-NGINX Ingress retirement).
2. **Containerization (Docker)**: Solved the "Matrix from Hell" by bundling a Node.js app with its dependencies (Express, MongoDB client, Redis client) using a shared kernel architecture.
3. **Orchestration (Docker Compose)**: Managed a multi-container production-ready stack including Node.js, MongoDB, and Redis, isolated behind the Envoy Gateway.
4. **Infrastructure as Code (Scripts)**: Automated the Docker and containerd installation process on Ubuntu VMs, with architecture detection for arm64/amd64.
5. **Kubernetes Architecture**: Implemented a High Availability (HA) deployment with 3 replicas, self-healing capabilities, and zero-downtime rolling updates.
6. **Envoy on Kubernetes**: Deployed Envoy Proxy as a K8s Deployment with a ConfigMap-mounted configuration and NodePort Service — mirroring the Docker Compose setup inside the cluster.
7. **Runtime Standards (CRI & OCI)**: Documented the transition from Docker Shim to **containerd** using the Container Runtime Interface.
8. **Clean Architecture (.gitignore)**: Implemented Git standards to exclude local dependencies and OS-specific files, keeping the repository professional and lightweight.
9. **Runtime Evolution (CRI)**: Added automated scripts for standalone **containerd** installation, moving away from Docker Shim as per modern Kubernetes requirements.

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
```

> This architecture is identical across both environments — Docker Compose for local dev, Kubernetes for production.

## Tech Stack & Tools
- **Proxy/Gateway**: Envoy Proxy v1.28
- **Runtime**: Node.js 18 (Alpine)
- **Container Engine**: Docker / containerd (CRI-compatible)
- **Orchestrator**: Kubernetes (K8s) via Minikube
- **CLI Tools**: `docker`, `kubectl`, `crictl`, `nerdctl`

##  Project Structure
- `/app`: Source code and package definitions.
- `/envoy`: Envoy Proxy configuration (used by Docker Compose).
- `/k8s`: Kubernetes manifests (Deployment, Services, ConfigMap).
- `/scripts`: Bash scripts for environment automation.
- `/docs`: Technical deep-dives into CRI and CLI tooling.
- `.gitignore`: Rules for excluding non-essential files.

## Key Concepts Covered
- **Control Plane vs. Worker Nodes**: Understanding the separation of management and execution layers.
- **etcd Consistency & Scheduler Logic**: How K8s maintains state and decides where to place Pods.
- **OCI Image Specifications**: Building standard-compliant images for any container runtime.
- **Self-healing via Replicas**: Ensuring high availability through automated pod recovery.
- **Zero-Downtime Rolling Updates**: Observed live as old pods terminated one-by-one while new ones came up.
- **DB Connectivity Checks**: The root endpoint (`/`) actively pings MongoDB and Redis on each request, reporting live connection status for both databases.
- **Cross-Architecture Scripting**: Automated scripts detect the host architecture (`arm64`/`amd64`) at runtime and download the correct binaries.

## Quick Start & Execution

Follow these steps to run the environment locally on your machine.

### Prerequisites
- **Docker & Docker Compose** installed.
- **Minikube** (for the Kubernetes part).

### 1. Run with Docker Compose (Local Dev)
This setup spins up the Node.js app, MongoDB, Redis, and the **Envoy Proxy** as the entry point.
```bash
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

#### Deploy the full stack:
```bash
# Start Minikube
minikube start

# Apply all manifests (app, mongodb, redis, envoy)
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