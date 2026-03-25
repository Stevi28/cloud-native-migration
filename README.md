# Cloud-Native Envoy Migration: From Monolith to Kubernetes

This project demonstrates a professional DevOps workflow, transitioning a Node.js application to a modern, scalable, and secure Cloud-Native architecture using Envoy Proxy and Kubernetes.

##  Project Milestones

1. **Modern Edge Proxy (Envoy)**: Replaced traditional NGINX with **Envoy Proxy (v1.28)** to align with the new **Kubernetes Gateway API** standards (post-NGINX Ingress retirement).
2. **Containerization (Docker)**: Solved the "Matrix from Hell" by bundling a Node.js app with its dependencies (Express, MongoDB client, Redis client) using a shared kernel architecture.
3. **Orchestration (Docker Compose)**: Managed a multi-container production-ready stack including Node.js, MongoDB, and Redis, isolated behind the Envoy Gateway.
4. **Infrastructure as Code (Scripts)**: Automated the Docker installation process on Ubuntu VMs.
5. **Kubernetes Architecture**: Implemented a High Availability (HA) deployment with 3 replicas and self-healing capabilities.
6. **Runtime Standards (CRI & OCI)**: Documented the transition from Docker Shim to **containerd** using the Container Runtime Interface.
7. **Clean Architecture (.gitignore)**: Implemented Git standards to exclude local dependencies and OS-specific files, keeping the repository professional and lightweight.
8. **Runtime Evolution (CRI)**: Added automated scripts for standalone **containerd** installation, moving away from Docker Shim as per modern Kubernetes requirements.

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

## Tech Stack & Tools
- **Proxy/Gateway**: Envoy Proxy
- **Runtime**: Node.js
- **Container Engine**: Docker / containerd (CRI-compatible)
- **Orchestrator**: Kubernetes (K8s)
- **CLI Tools**: `docker`, `kubectl`, `crictl`, `nerdctl`

##  Project Structure
- `/app`: Source code and package definitions.
- `/envoy`: Envoy Proxy configuration
- `/k8s`: Kubernetes Deployment manifests.
- `/scripts`: Bash scripts for environment automation.
- `/docs`: Technical deep-dives into CRI and CLI tooling.
- `.gitignore`: Rules for excluding non-essential files.

## Key Concepts Covered
- **Control Plane vs. Worker Nodes**: Understanding the separation of management and execution layers.
- **etcd Consistency & Scheduler Logic**: How K8s maintains state and decides where to place Pods.
- **OCI Image Specifications**: Building standard-compliant images for any container runtime.
- **Self-healing via Replicas**: Ensuring high availability through automated pod recovery.
- **DB Connectivity Checks**: The root endpoint (`/`) actively pings MongoDB and Redis on each request, reporting live connection status for both databases.

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
### 2. Run on Kubernetes (Minikube)
To test the high-availability deployment:
```bash
# Start Minikube
minikube start

# Apply the Deployment manifest
kubectl apply -f k8s/deployment.yaml

# Verify the 3 Replicas (Self-healing)
kubectl get pods
```
**App URL**: http://localhost (No port needed, Envoy handles it!)
**Envoy Admin**: http://localhost:9901

### 3. Cleanup
To stop everything and free up system resources:
```bash
docker-compose down
minikube stop
```
