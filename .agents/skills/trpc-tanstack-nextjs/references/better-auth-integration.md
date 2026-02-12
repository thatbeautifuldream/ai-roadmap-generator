# Better Auth + tRPC Integration

Add session and user data to tRPC context using Better Auth.

## Modified Context

```typescript
// trpc/init.ts
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import superjson from "superjson";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type SessionData = Awaited<ReturnType<typeof auth.api.getSession>>;

export interface TRPCContext {
  db: typeof db;
  session: SessionData;
  headers: Headers;
}

export const createTRPCContext = async (): Promise<TRPCContext> => {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  return { db, session, headers: headersList };
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

// Protected procedure with typed user context
export const protectedProcedure = t.procedure.use(async (opts) => {
  if (!opts.ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }
  return opts.next({
    ctx: { session: opts.ctx.session, user: opts.ctx.session.user },
  });
});
```

## Usage in Procedures

```typescript
// Public - session may be null
export const someRouter = createTRPCRouter({
  publicEndpoint: publicProcedure.query(({ ctx }) => {
    // ctx.session may be null
    const userName = ctx.session?.user?.name ?? "Guest";
    return { greeting: `Hello, ${userName}` };
  }),

  // Protected - user guaranteed
  protectedEndpoint: protectedProcedure.query(({ ctx }) => {
    // ctx.user is guaranteed to exist
    return { userId: ctx.user.id, email: ctx.user.email };
  }),
});
```

## Type Inference

```typescript
// The protected context has narrowed types
type ProtectedContext = {
  db: typeof db;
  session: NonNullable<SessionData>;
  user: NonNullable<SessionData>["user"];
  headers: Headers;
};
```

## Cookies in Client

Ensure cookies are sent with requests:

```typescript
// trpc/client.tsx
httpBatchLink({
  url: `${getBaseUrl()}/api/trpc`,
  transformer: superjson,
  fetch(url, options) {
    return fetch(url, { ...options, credentials: "include" });
  },
}),
```
