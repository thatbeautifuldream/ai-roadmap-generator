# WebSocket Subscriptions with tRPC

Real-time data with WebSocket subscriptions in Next.js.

## Install Dependencies

```bash
pnpm add @trpc/server ws
pnpm add -D @types/ws
```

## Subscription Router

```typescript
// trpc/routers/realtime.ts
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../init";
import { EventEmitter } from "events";

// Shared event emitter for pub/sub
const ee = new EventEmitter();

export const realtimeRouter = createTRPCRouter({
  onMessage: publicProcedure
    .input(z.object({ channelId: z.string() }))
    .subscription(({ input }) => {
      return observable<{ id: string; text: string; createdAt: Date }>((emit) => {
        const onMessage = (data: { id: string; text: string; createdAt: Date }) => {
          emit.next(data);
        };

        ee.on(`message:${input.channelId}`, onMessage);

        return () => {
          ee.off(`message:${input.channelId}`, onMessage);
        };
      });
    }),

  sendMessage: publicProcedure
    .input(z.object({ channelId: z.string(), text: z.string() }))
    .mutation(async ({ input }) => {
      const message = {
        id: crypto.randomUUID(),
        text: input.text,
        createdAt: new Date(),
      };
      ee.emit(`message:${input.channelId}`, message);
      return message;
    }),
});
```

## WebSocket Server (Custom Server)

```typescript
// server/wss.ts
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";
import { appRouter } from "@/trpc/routers/_app";
import { createTRPCContext } from "@/trpc/init";

const wss = new ws.Server({ port: 3001 });

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: createTRPCContext,
});

wss.on("connection", (ws) => {
  console.log(`Connection opened (${wss.clients.size} total)`);
  ws.once("close", () => {
    console.log(`Connection closed (${wss.clients.size} total)`);
  });
});

console.log("WebSocket Server listening on ws://localhost:3001");

process.on("SIGTERM", () => {
  handler.broadcastReconnectNotification();
  wss.close();
});
```

## Client Setup with WebSocket Link

```typescript
// trpc/client.tsx
"use client";

import { createWSClient, wsLink, splitLink, httpBatchLink } from "@trpc/client";
import { createTRPCClient } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "./routers/_app";

const wsClient = typeof window !== "undefined"
  ? createWSClient({ url: "ws://localhost:3001" })
  : null;

const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        splitLink({
          condition: (op) => op.type === "subscription",
          true: wsLink({ client: wsClient! }),
          false: httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
            transformer: superjson,
          }),
        }),
      ],
    }),
  );

  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </TRPCProvider>
  );
}
```

## Using Subscriptions in Components

```typescript
"use client";

import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc";
import { useSubscription } from "@tanstack/react-query";

function ChatRoom({ channelId }: { channelId: string }) {
  const trpc = useTRPC();
  const [messages, setMessages] = useState<Array<{ id: string; text: string }>>([]);

  // Subscribe to new messages
  useSubscription(
    trpc.realtime.onMessage.subscriptionOptions(
      { channelId },
      {
        onData: (message) => {
          setMessages((prev) => [...prev, message]);
        },
        onError: (err) => {
          console.error("Subscription error:", err);
        },
      }
    )
  );

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.text}</div>
      ))}
    </div>
  );
}
```

## Alternative: Server-Sent Events (No WebSocket)

For simpler real-time needs without WebSocket infrastructure:

```typescript
// app/api/sse/route.ts
export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        const data = JSON.stringify({ time: new Date().toISOString() });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }, 1000);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```
