# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev              # Start development server
bun build            # Production build
bun lint             # Run ESLint
bun db:generate      # Generate Drizzle migrations
bun db:migrate       # Run migrations
bun db:push          # Push schema to database (dev)
bun db:studio        # Open Drizzle Studio
```

## Architecture

AI-powered learning roadmap generator built with Next.js 16 (App Router), React 19, and multi-provider AI support.

### Core Data Flow

1. User enters a topic query in `/src/components/flow-components/Search.tsx`
2. `POST /api/v1/roadmap` generates structured roadmap via AI SDK (`generateObject`)
3. Response is transformed into tree structure and stored in PostgreSQL
4. ReactFlow renders the roadmap as an interactive node graph using d3-hierarchy layout

### Key Directories

- `src/actions/` - Server actions (Clerk auth + Drizzle queries)
- `src/lib/ai/` - Multi-model AI abstraction (OpenAI, Gemini, Cohere, Groq)
- `src/lib/stores/` - Zustand stores for UI state
- `src/db/schema.ts` - Drizzle ORM schema (users, roadmaps, savedRoadmaps, drawerDetails)
- `src/components/flow-components/` - ReactFlow roadmap visualization
- `src/components/ui/` - shadcn/ui components (new-york style)

### AI Provider System

`src/lib/ai/index.ts` abstracts model selection:
- Supports user-provided API keys or server defaults
- Groq uses OpenAI-compatible API endpoint
- Schema-based generation via Zod (`src/lib/ai/schemas.ts`)

### State Management

- **Zustand** (`useUIStore`): model selection, drawer state, query state, API keys
- **TanStack Query**: server state, roadmap fetching, mutations

### Authentication

Clerk handles auth with webhooks syncing users to database. Route groups:
- `(auth)/` - sign-in/sign-up pages
- `(private)/` - dashboard, authenticated roadmap generation
- `(public)/` - explore page for public roadmaps

### Database

PostgreSQL via Drizzle ORM. Key relationships:
- Users have many roadmaps and savedRoadmaps
- Roadmaps have many drawerDetails (cached node explanations)
- Credits system: 5 free generations, decremented per use (unless user provides own API key)
