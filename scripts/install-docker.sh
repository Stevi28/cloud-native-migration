#!/bin/bash
# auto-install docker on ubuntu

echo "Starting Docker installation..."

# update package list
sudo apt-get update

# install docker (docker.io)
sudo apt-get install docker.io -y

# start docker service
sudo systectl start docker
sudo systemctl enable docker

# check version
docker version

echo "Installation complete! Testing with hello-world..."
sudo docker run hello-world