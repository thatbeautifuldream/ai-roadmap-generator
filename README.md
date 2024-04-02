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

## Local Database setup

- We use `PostgreSQL` for the database.
- You can use this compose file to setup the database locally.

## Setting up Environment Variables

- Create a `.env` file in the root directory of the project.
- Add the following environment variables to the `.env` file:

```env
# Database
DATABASE_URL=

# API Keys
OPENAI_API_KEY=
GEMINI_API_KEY=
COHERE_API_KEY=

# Cloud Console API Keys
KNOWLEDGE_GRAPH_SEARCH_KEY=
YOUTUBE_API_KEY=

# Clerk (Production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Setting up Docker Image and pusing it to Github Container Registry

```bash
docker login ghcr.io
docker build . --platform linux/amd64 -t ghcr.io/thatbeautifuldream/ai-roadmap-generator:latest
docker push ghcr.io/thatbeautifuldream/ai-roadmap-generator:latest
docker run -p 3000:3000 ghcr.io/thatbeautifuldream/ai-roadmap-generator:latest
```
