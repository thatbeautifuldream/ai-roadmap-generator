import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter } from "../init";
import { roadmapRouter } from "./roadmap";
import { userRouter } from "./user";
import { orilleyRouter } from "./orilley";

export const appRouter = createTRPCRouter({
  roadmap: roadmapRouter,
  user: userRouter,
  orilley: orilleyRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
