# Roadmap AI

![roadmapai](https://github.com/vishwajeetraj11/ai-roadmap-generator/assets/28717686/0fa80335-6635-4905-8a1b-cdcea8926d94)

## Introduction

This project generates learning roadmaps for given search queries. For example, if a user searches for "machine learning", the project will generate a learning roadmap for machine learning. The roadmap will include the most important topics, resources, and learning paths for machine learning.

## Setting up the project locally

- We use `pnpm` for package management. You can install `pnpm` by following the instructions [here](https://pnpm.io/installation).
- To install the dependencies, run `pnpm install`.
- To start the development server, run `pnpm dev`.
- To build the project, run `pnpm build`.
- To start the production server, run `pnpm start`.

## Features

- Multimodel Support .
- Share roadmap via public URL.
- Recommended Orilley Books.

## Building and pusing the docker image to `ghcr.io` from the local machine

```bash
docker login ghcr.io
docker build . --platform linux/amd64 -t ghcr.io/thatbeautifuldream/ai-roadmap-generator:latest
docker push ghcr.io/thatbeautifuldream/ai-roadmap-generator:latest
```

## Pulling and running docker image on the server

```bash
docker pull ghcr.io/thatbeautifuldream/ai-roadmap-generator:latest
docker run -d -p 3000:3000 --name ai-roadmap-generator ghcr.io/thatbeautifuldream/ai-roadmap-generator:latest
```
