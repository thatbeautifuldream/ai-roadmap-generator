# Creating tRPC Routers

## Basic Router Structure

```typescript
// trpc/routers/feature.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../init";

export const featureRouter = createTRPCRouter({
  // Query - fetch data
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.features.findMany();
  }),

  // Query with input
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.features.findFirst({
        where: (f, { eq }) => eq(f.id, input.id),
      });
    }),

  // Mutation - modify data
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(features).values({
        name: input.name,
        userId: ctx.user.id,
      });
    }),

  // Mutation with complex input
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.update(features)
        .set(input.data)
        .where(eq(features.id, input.id));
    }),

  // Delete
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(features).where(eq(features.id, input.id));
    }),
});
```

## Register Router in App Router

```typescript
// trpc/routers/_app.ts
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter } from "../init";
import { featureRouter } from "./feature";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  feature: featureRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
```

## Nested Routers

```typescript
// trpc/routers/admin/index.ts
import { createTRPCRouter } from "../../init";
import { usersRouter } from "./users";
import { settingsRouter } from "./settings";

export const adminRouter = createTRPCRouter({
  users: usersRouter,
  settings: settingsRouter,
});

// Usage: trpc.admin.users.list.queryOptions()
```

## Protected Procedure Middleware

```typescript
// trpc/init.ts
export const protectedProcedure = t.procedure.use(async (opts) => {
  if (!opts.ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in",
    });
  }
  return opts.next({
    ctx: { session: opts.ctx.session, user: opts.ctx.session.user },
  });
});

// Admin-only procedure
export const adminProcedure = protectedProcedure.use(async (opts) => {
  if (opts.ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return opts.next();
});
```

## Input Validation with Zod

```typescript
const createSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(10),
  tags: z.array(z.string()).max(5).optional(),
  publishAt: z.date().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

create: protectedProcedure
  .input(createSchema)
  .mutation(async ({ ctx, input }) => {
    // input is fully typed
  }),
```

## Output Validation

```typescript
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

getUser: publicProcedure
  .input(z.object({ id: z.string() }))
  .output(userSchema)
  .query(async ({ ctx, input }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, input.id),
    });
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });
    return user; // Must match userSchema
  }),
```
