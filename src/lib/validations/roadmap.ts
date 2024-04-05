import * as z from "zod";

export const roadmapSchema = z.object({
  query: z.string(),
  chapters: z.record(
    z.string(),
    z.array(
      z.object({
        moduleName: z.string(),
        moduleDescription: z.string(),
        link: z.string().optional(),
      })
    )
  ),
});
