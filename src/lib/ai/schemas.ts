import { z } from "zod";

export const moduleSchema = z.object({
  moduleName: z.string(),
  moduleDescription: z.string(),
  link: z.string().optional(),
});

export const roadmapSchema = z.object({
  query: z.string(),
  chapters: z.record(z.string(), z.array(moduleSchema)),
});

export const detailsSchema = z.object({
  description: z.string(),
  link: z.string().optional(),
  bulletPoints: z.array(z.string()).optional(),
});

export type RoadmapOutput = z.infer<typeof roadmapSchema>;
export type DetailsOutput = z.infer<typeof detailsSchema>;
