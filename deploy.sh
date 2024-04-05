#!/bin/bash

# Build the Docker image
echo "Building Docker image..."
docker compose build

# Push the Docker image to the registry
echo "Pushing Docker image to registry..."
docker compose push

# Stop and remove the existing Docker container
echo "Stopping and removing existing Docker container..."
docker stop ai-roadmap-generator
docker rm ai-roadmap-generator

# Deploy the Docker container
echo "Deploying Docker container..."
docker compose up -d deploy

echo "Deployment completed successfully!"