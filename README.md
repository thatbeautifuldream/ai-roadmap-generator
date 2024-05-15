# Roadmap AI

![opengraph-image](https://github.com/thatbeautifuldream/ai-roadmap-generator/assets/28717686/3c9c981f-364e-4de0-9016-b8d9cf147b43)

## Introduction

This project generates learning roadmaps for given search queries. For example, if a user searches for "machine learning", the project will generate a learning roadmap for machine learning. The roadmap will include the most important topics, resources, and learning paths for machine learning.

## Setting up the project locally

- We use `pnpm` for package management. You can install `pnpm` by following the instructions [here](https://pnpm.io/installation).
- To install the dependencies, run `pnpm install`.
- To start the development server, run `pnpm dev`.
- To build the project, run `pnpm build`.
- To start the production server, run `pnpm start`.

## Trigger new user creation locally

- To trigger a new user creation locally, we'll need to trigger our webhook server. To do this, we can use the `ngrok` tool. You can install `ngrok` by following the instructions [here](https://ngrok.com/download).
- You'll need to first create an account on ngrok and add your auth token by running `ngrok config add-authtoken <your_auth_token>`. Now you'll be able to start the `ngrok` server.
- We'll forward our `:3000` to a public URL. To do this, run `ngrok http 3000`.
- We have made it easier for you to forward this webhook publicly by running `pnpm ngrok`.
- After starting the `ngrok` server, make sure to add it in the clerk developement instance un webhook and check it to trigger on new user creation labelled as `User Created`.
  > Make sure to append `/api/webhook` to the ngrok URL while adding it to the clerk development dashboard.

![clerk dashboard screenshot](https://github.com/thatbeautifuldream/ai-roadmap-generator/assets/28717686/ff8d3136-17bb-47db-a850-a1171677aa43)

## Features

- Multimodel Support .
- Share roadmap via public URL.
- Recommended Orilley Books.

## Building and pusing the docker image to `ghcr.io` from the local machine

```bash
docker login ghcr.io
docker build . -t ghcr.io/thatbeautifuldream/ai-roadmap-generator:latest
docker push ghcr.io/thatbeautifuldream/ai-roadmap-generator:latest
```

## Pulling and running docker image on the server

```bash
docker pull ghcr.io/thatbeautifuldream/ai-roadmap-generator:latest
docker run -d -p 3000:3000 --name ai-roadmap-generator ghcr.io/thatbeautifuldream/ai-roadmap-generator:latest
```

<a href="https://github.com/thatbeautifuldream/ai-roadmap-generator/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=thatbeautifuldream/ai-roadmap-generator" />
</a>
