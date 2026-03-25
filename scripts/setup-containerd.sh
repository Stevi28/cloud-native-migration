#!/bin/bash
# script to install standalone containerd (cri-compliant runtime)
# based on k8s v1.24+ standards (removal of docker shim)

echo "Starting standalone containerd installation..."

# download the containerd binary 
wget https://github.com/containerd/containerd/releases/download/v1.6.2/containerd-1.6.2-linux-amd64.tar.gz

# extract the binaries to /usr/local
sudo tar -C /usr/local -xzvf containerd-1.6.2-linux-amd64.tar.gz

# verify the installation using the 'ctr' tool
echo "Verifying installation with 'ctr'..."
sudo ctr version

echo "ContainerD is now ready to serve as a CRI for Kubernetes."