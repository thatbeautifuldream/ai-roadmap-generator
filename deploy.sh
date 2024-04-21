#!/bin/bash

# Load environment variables from .env file
source .env

echo "DOCKER_IMAGE_URL: $DOCKER_IMAGE_URL"
echo "WEBHOOK_URL: $WEBHOOK_URL"

# Pull latest changes from GitHub
git pull

# Build and push Docker image to container registry
docker build . -t "${DOCKER_IMAGE_URL}:latest" && docker push "${DOCKER_IMAGE_URL}:latest"

# Check the exit status of the previous command
if [ $? -eq 0 ]; then
    echo "Docker build and push successful"
    # Call the webhook
    webhook_response=$(curl -X POST -s "${WEBHOOK_URL}")
    webhook_status=$?
    if [ $webhook_status -eq 0 ]; then
        echo "Webhook call successful"
    else
        echo "Webhook call failed: $webhook_response"
    fi
else
    echo "Docker build and push failed"
    exit 1
fi