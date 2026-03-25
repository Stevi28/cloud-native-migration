# Container Runtime Interface (CRI) & CLI Tools

This document compares the tools used to interact with the container runtime on a Kubernetes Node.

| Tool | Purpose | Context |
| :--- | :--- | :--- |
| **docker** | Development | Building and running containers locally. |
| **nerdctl** | Pro-ContainerD | Docker-compatible CLI for containerd (supports lazy pulling). |
| **crictl** | K8s Debugging | Standard tool for inspecting CRI-compatible runtimes on Nodes. |
| **ctr** | Runtime Dev | Low-level debugging for the containerd daemon. |

## Why ContainerD?
Kubernetes (v1.24+) removed support for **Docker Shim**. We now use the **CRI** to communicate directly with **containerd**, reducing overhead and improving security.