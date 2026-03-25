# Cloud-Native Migration: From Monolith to Kubernetes

This project demonstrates a complete DevOps workflow. It covers the transition from local development to a scalable, managed Kubernetes architecture.

##  Project Milestones

1. **Containerization (Docker)**: Solved the "Matrix from Hell" by bundling a Node.js app with its dependencies (Express) using a shared kernel architecture.
2. **Orchestration (Docker Compose)**: Managed a multi-container stack including Node.js, MongoDB, and Redis.
3. **Infrastructure as Code (Scripts)**: Automated the Docker installation process on Ubuntu VMs.
4. **Kubernetes Architecture**: Implemented a High Availability (HA) deployment with 3 replicas.
5. **Runtime Standards (CRI & OCI)**: Documented the transition from Docker Shim to **containerd** using the Container Runtime Interface.
6. **Clean Architecture (.gitignore)**: Implemented Git standards to exclude local dependencies and OS-specific files, keeping the repository professional and lightweight.
7. **Runtime Evolution (CRI)**: Added automated scripts for standalone **containerd** installation, moving away from Docker Shim as per modern Kubernetes requirements.

## Tech Stack & Tools
- **Runtime**: Node.js
- **Container Engine**: Docker / containerd
- **Orchestrator**: Kubernetes (K8s)
- **CLI Tools**: `docker`, `kubectl`, `crictl`, `nerdctl`

##  Project Structure
- `/app`: Source code and package definitions.
- `/k8s`: Kubernetes Deployment manifests.
- `/scripts`: Bash scripts for environment automation.
- `/docs`: Technical deep-dives into CRI and CLI tooling.
- `.gitignore`: Rules for excluding non-essential files.

## Key Concepts Covered
- Control Plane vs. Worker Nodes (Master/Worker)
- etcd consistency and Scheduler logic
- OCI Image Specifications
- Self-healing via Replicas