import "server-only";

import { dehydrate } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import superjson from "superjson";
import { createTRPCContext, createCallerFactory } from "../init";
import { appRouter } from "../routers/_app";
import { makeQueryClient } from "../query-client";
import type { AppRouter } from "../routers/_app";

export const getQueryClient = cache(makeQueryClient);

const createCaller = createCallerFactory(appRouter);

export const getCaller = cache(async () => {
  const ctx = await createTRPCContext();
  return createCaller(ctx);
});

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const trpc = createTRPCOptionsProxy<AppRouter>({
  queryClient: getQueryClient,
  client: createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
        transformer: superjson,
      }),
    ],
  }),
});

export function prefetch<T>(queryOptions: T) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(queryOptions as Parameters<typeof queryClient.prefetchQuery>[0]);
}

export function dehydrateClient() {
  const queryClient = getQueryClient();
  return dehydrate(queryClient);
}
