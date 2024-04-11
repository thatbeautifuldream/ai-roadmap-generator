#!/bin/bash

# Git pull
git pull

# Build and push Docker image
docker compose build && docker compose push

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
docker compose up -d

# Check the exit status of the previous command
if [ $? -eq 0 ]; then
    echo "Deployment successful"
else
    echo "Deployment failed"
    exit 1
fi