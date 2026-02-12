import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export interface TRPCContext {
  db: typeof db;
  headers: Headers;
  user: Awaited<ReturnType<typeof currentUser>> | null;
}

export const createTRPCContext = async (): Promise<TRPCContext> => {
  const headersList = await headers();
  const user = await currentUser();
  return { db, headers: headersList, user };
};

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async (opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }
  return opts.next({
    ctx: { user: opts.ctx.user },
  });
});
