# Roadmap AI

<!-- ![roadmapai](https://github.com/vishwajeetraj11/ai-roadmap-generator/assets/28717686/a6a25a10-bf5f-43b7-8ac3-9e6276dd14f6) -->

![roadmapai](https://github.com/vishwajeetraj11/ai-roadmap-generator/assets/28717686/effca7be-ad3c-46a2-88d3-371147b39eda)

## Introduction

This project generates learning roadmaps for given search queries. For example, if a user searches for "machine learning", the project will generate a learning roadmap for machine learning. The roadmap will include the most important topics, resources, and learning paths for machine learning.

## Setting up the project locally

- We use `pnpm` for package management. You can install `pnpm` by following the instructions [here](https://pnpm.io/installation).
- To install the dependencies, run `pnpm install`.
- To start the development server, run `pnpm dev`.
- To build the project, run `pnpm build`.
- To start the production server, run `pnpm start`.

## Local Database setup

- We use `PostgreSQL` for the database. You can use the provided `docker-compose.yml` file to start a `PostgreSQL` server. Run `docker-compose up` to start the server.
- The compose file automatically sets up the database and an adminer instance to manage the database.

## Setting up Environment Variables

- Create a `.env` file in the root directory of the project.
- Add the following environment variables to the `.env` file:

```env
// for local development
DATABASE_URL=postgres://<username>:<password>@localhost:5432/<database_name>

// for authentication
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

// for APIs you can choose to add any one or all of them but then you need to call the respective API from the dropdown selection
OPENAI_API_KEY=
GOOGLE_API_KEY=
COHERE_API_KEY=
```
