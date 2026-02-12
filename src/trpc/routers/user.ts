import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../init";
import { users } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  getCredits: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
        columns: {
          credits: true,
        },
      });

      return user?.credits ?? 0;
    }),

  hasCredits: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
        columns: {
          credits: true,
        },
      });

      if (user && user.credits > 0) {
        return true;
      }
      return false;
    }),

  decrementCredits: protectedProcedure
    .mutation(async ({ ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
      });

      if (user && user.credits > 0) {
        await ctx.db
          .update(users)
          .set({
            credits: sql`${users.credits} - 1`,
          })
          .where(eq(users.id, ctx.user.id));
        return true;
      }
      return false;
    }),

  incrementCredits: protectedProcedure
    .mutation(async ({ ctx }) => {
      await ctx.db
        .update(users)
        .set({
          credits: sql`${users.credits} + 1`,
        })
        .where(eq(users.id, ctx.user.id));
    }),

  getTotal: publicProcedure
    .query(async ({ ctx }) => {
      const [{ value: totalUsers }] = await ctx.db
        .select({ value: count() })
        .from(users);
      return totalUsers;
    }),
});
