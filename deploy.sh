#!/bin/bash

# Pull latest changes from GitHub
git pull

# Build and push Docker image to container registry
docker build . -t ghcr.io/thatbeautifuldream/ai-roadmap-generator:latest && docker push ghcr.io/thatbeautifuldream/ai-roadmap-generator:latest

# Check the exit status of the previous command
if [ $? -eq 0 ]; then
    echo "Docker build and push successful"
else
    echo "Docker build and push failed"
    exit 1
fi

# Stop, remove, and start the container
docker stop ai-roadmap-generator
docker rm ai-roadmap-generator
docker run -d -p 3000:3000 --name ai-roadmap-generator ghcr.io/thatbeautifuldream/ai-roadmap-generator:latest

# Check the exit status of the previous command
if [ $? -eq 0 ]; then
    echo "Deployment successful"
else
    echo "Deployment failed"
    exit 1
fi
