#!/bin/bash

# Pull latest changes from GitHub
git pull

# Build and push Docker image to container registry
docker build . -t ghcr.io/thatbeautifuldream/ai-roadmap-generator:latest && docker push ghcr.io/thatbeautifuldream/ai-roadmap-generator:latest

# Check the exit status of the previous command
if [ $? -eq 0 ]; then
  echo "Docker build and push successful"

  # Call the webhook
  webhook_response=$(curl -X POST -s https://manage.milind.live/api/stacks/webhooks/3737fba9-0cd2-47f0-83a2-37770cb910a4)
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
