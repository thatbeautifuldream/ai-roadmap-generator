import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/trpc/routers/_app";
import { createTRPCContext } from "@/trpc/init";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError: process.env.NODE_ENV === "development"
      ? ({ path, error }) => console.error(`tRPC failed on ${path ?? "<no-path>"}: ${error.message}`)
      : undefined,
  });

export { handler as GET, handler as POST };
