import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../init";
import axios from "axios";

export const orilleyRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1),
    }))
    .query(async ({ input }) => {
      const { data } = await axios.get(
        `https://learning.oreilly.com/api/v2/search/?query=${input.query}&formats=book&limit=2`
      );
      return data;
    }),
});
