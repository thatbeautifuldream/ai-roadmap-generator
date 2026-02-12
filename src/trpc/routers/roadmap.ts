import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../init";
import { roadmaps, savedRoadmaps, drawerDetails } from "@/db/schema";
import { eq, and, ilike, desc, sql, count } from "drizzle-orm";
import { Node } from "@/lib/shared/types/common";
import { capitalize } from "@/lib/utils";
import { generateObject } from "ai";
import { getModel, type Provider } from "@/lib/ai";
import { roadmapSchema, detailsSchema } from "@/lib/ai/schemas";

const SYSTEM_PROMPT = `You are a helpful AI assistant that can generate career/syllabus roadmap. You can arrange it in a way so that the order of the chapters is always from beginner to advanced. Always generate a minimum of 4 modules inside a chapter, link to wikipedia if possible. PLEASE REFRAIN FROM GENERATING ANY OBSCURE CONTENT AS THIS PLATFORM IS A LEARNING PLATFORM.`;

const DETAILS_SYSTEM_PROMPT = `You are a helpful AI assistant that can generate career/syllabus roadmap.`;

export const roadmapRouter = createTRPCRouter({
  generate: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      provider: z.enum(["openai", "gemini", "cohere", "groq"]).optional(),
      apiKey: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { query, provider, apiKey } = input;
      const selectedProvider = provider || "openai";

      const normalizedQuery = query.replace(/\s+/g, "").toLowerCase();
      const alreadyExists = await ctx.db.query.roadmaps.findMany({
        where: ilike(roadmaps.title, `%${normalizedQuery}%`),
      });

      if (alreadyExists.length > 0) {
        await ctx.db
          .update(roadmaps)
          .set({
            searchCount: sql`${roadmaps.searchCount} + 1`,
          })
          .where(eq(roadmaps.id, alreadyExists[0].id));
        
        const tree = JSON.parse(alreadyExists[0].content);
        return { tree, roadmapId: alreadyExists[0].id };
      }

      const model = getModel(selectedProvider as Provider, apiKey);

      const { object: json } = await generateObject({
        model,
        schema: roadmapSchema,
        system: SYSTEM_PROMPT,
        prompt: `Generate a roadmap in JSON format related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: [{moduleName: string, moduleDescription: string, link?: string}]}}`,
      });

      const tree: Node[] = [
        {
          name: capitalize(json.query),
          children: Object.keys(json.chapters).map((sectionName) => ({
            name: sectionName,
            children: json.chapters[sectionName]?.map(
              ({ moduleName, link, moduleDescription }) => ({
                name: moduleName,
                moduleDescription,
                link,
              })
            ),
          })),
        },
      ];

      const userId = ctx.user?.id;

      const [roadmap] = await ctx.db
        .insert(roadmaps)
        .values({
          userId: userId || "",
          title: query,
          content: JSON.stringify(tree),
        })
        .returning();

      return { tree, roadmapId: roadmap.id };
    }),

  search: publicProcedure
    .input(z.object({
      query: z.string().min(1),
    }))
    .query(async ({ ctx, input }) => {
      const searchResults = await ctx.db.query.roadmaps.findMany({
        where: and(
          ilike(roadmaps.title, `%${input.query}%`),
          eq(roadmaps.visibility, "PUBLIC")
        ),
      });
      return searchResults;
    }),

  getDetails: publicProcedure
    .input(z.object({
      query: z.string(),
      child: z.string(),
      parent: z.string(),
      provider: z.enum(["openai", "gemini", "cohere", "groq"]).optional(),
      apiKey: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const { query, child, parent, provider, apiKey } = input;
      const selectedProvider = provider || "openai";

      const model = getModel(selectedProvider as Provider, apiKey);

      const { object: json } = await generateObject({
        model,
        schema: detailsSchema,
        system: DETAILS_SYSTEM_PROMPT,
        prompt: `A roadmap in JSON format has been generated related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: [{moduleName: string, moduleDescription: string, link?: string}]}} and I'd like to request a small description, wikipedia link, and bullet points on moduleName: ${child} from chapterName: ${parent} in JSON format: {description: string, link: string, bulletPoints: string[]}`,
      });

      return json;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const roadmap = await ctx.db.query.roadmaps.findFirst({
        where: eq(roadmaps.id, input.id),
      });
      return roadmap;
    }),

  getByUserId: protectedProcedure
    .query(async ({ ctx }) => {
      const result = await ctx.db.query.roadmaps.findMany({
        where: eq(roadmaps.userId, ctx.user.id),
      });
      return result;
    }),

  getPublic: publicProcedure
    .input(z.object({
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(21),
    }))
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;

      const result = await ctx.db.query.roadmaps.findMany({
        where: eq(roadmaps.visibility, "PUBLIC"),
        with: {
          author: {
            columns: {
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: desc(roadmaps.createdAt),
        offset: (page - 1) * pageSize,
        limit: pageSize,
      });

      const [{ value: totalCount }] = await ctx.db
        .select({ value: count() })
        .from(roadmaps)
        .where(eq(roadmaps.visibility, "PUBLIC"));

      const pageCount = Math.ceil(totalCount / pageSize);

      return { roadmaps: result, pageCount };
    }),

  getSavedByUserId: protectedProcedure
    .query(async ({ ctx }) => {
      const result = await ctx.db.query.savedRoadmaps.findMany({
        where: eq(savedRoadmaps.userId, ctx.user.id),
      });
      return result;
    }),

  checkTitleInUsersRoadmaps: publicProcedure
    .input(z.object({ title: z.string() }))
    .query(async ({ ctx, input }) => {
      const normalizedTitle = input.title.trim().toLowerCase().replace(/\s+/g, "");

      const roadmap = await ctx.db.query.roadmaps.findFirst({
        where: ilike(roadmaps.title, `%${normalizedTitle}%`),
      });

      if (roadmap && roadmap.visibility === "PUBLIC") {
        return { state: true, id: roadmap.id, title: roadmap.title };
      } else {
        return { state: false };
      }
    }),

  incrementViews: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const roadmap = await ctx.db.query.roadmaps.findFirst({
        where: eq(roadmaps.id, input.id),
      });

      if (!roadmap) {
        return;
      }

      await ctx.db
        .update(roadmaps)
        .set({
          views: sql`${roadmaps.views} + 1`,
        })
        .where(eq(roadmaps.id, input.id));
    }),

  changeVisibility: protectedProcedure
    .input(z.object({
      roadmapId: z.string(),
      visibility: z.enum(["PRIVATE", "PUBLIC"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const roadmap = await ctx.db.query.roadmaps.findFirst({
        where: eq(roadmaps.id, input.roadmapId),
      });

      if (!roadmap || roadmap.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to change visibility of this roadmap.",
        });
      }

      await ctx.db
        .update(roadmaps)
        .set({ visibility: input.visibility })
        .where(eq(roadmaps.id, input.roadmapId));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const roadmap = await ctx.db.query.roadmaps.findFirst({
        where: eq(roadmaps.id, input.id),
      });

      if (!roadmap) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Roadmap not found.",
        });
      }

      if (roadmap.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to delete this roadmap.",
        });
      }

      await ctx.db.delete(roadmaps).where(eq(roadmaps.id, input.id));

      return { status: "success", message: "Roadmap successfully deleted." };
    }),

  saveToDashboard: protectedProcedure
    .input(z.object({ roadmapId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingSavedRoadmap = await ctx.db.query.savedRoadmaps.findFirst({
        where: and(
          eq(savedRoadmaps.userId, ctx.user.id),
          eq(savedRoadmaps.roadmapId, input.roadmapId)
        ),
      });

      if (existingSavedRoadmap) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Already saved.",
        });
      }

      const roadmap = await ctx.db.query.roadmaps.findFirst({
        where: eq(roadmaps.id, input.roadmapId),
      });

      if (!roadmap) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Roadmap not found.",
        });
      }

      await ctx.db.insert(savedRoadmaps).values({
        userId: ctx.user.id,
        roadmapId: input.roadmapId,
        title: roadmap.title,
      });

      return {
        status: "success",
        message: "Roadmap saved successfully.",
      };
    }),

  deleteSaved: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const savedRoadmap = await ctx.db.query.savedRoadmaps.findFirst({
        where: eq(savedRoadmaps.id, input.id),
      });

      if (!savedRoadmap) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Saved roadmap not found.",
        });
      }

      if (savedRoadmap.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to delete this saved roadmap.",
        });
      }

      await ctx.db.delete(savedRoadmaps).where(eq(savedRoadmaps.id, input.id));

      return { status: "success", message: "Saved roadmap successfully deleted." };
    }),

  isOwnerOrSaved: publicProcedure
    .input(z.object({ roadmapId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user?.id;

      const roadmap = await ctx.db.query.roadmaps.findFirst({
        where: eq(roadmaps.id, input.roadmapId),
        with: {
          author: true,
        },
      });

      const savedRoadmap = userId
        ? await ctx.db.query.savedRoadmaps.findFirst({
            where: and(
              eq(savedRoadmaps.userId, userId),
              eq(savedRoadmaps.roadmapId, input.roadmapId)
            ),
          })
        : null;

      return {
        isGeneratedByUser: roadmap?.userId === userId,
        isSavedByUser: !!savedRoadmap,
        isAuthor: roadmap?.author.id === userId,
      };
    }),

  saveNodeDetails: publicProcedure
    .input(z.object({
      roadmapId: z.string(),
      nodeName: z.string(),
      content: z.string(),
      books: z.string(),
      youtubeVideoIds: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      const [savedDetail] = await ctx.db
        .insert(drawerDetails)
        .values({
          roadmapId: input.roadmapId,
          nodeName: input.nodeName,
          details: input.content,
          youtubeVideoIds: input.youtubeVideoIds,
          books: input.books,
        })
        .returning();

      return savedDetail;
    }),

  findNodeDetails: publicProcedure
    .input(z.object({
      roadmapId: z.string(),
      nodeName: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const savedNodeDetails = await ctx.db.query.drawerDetails.findFirst({
        where: and(
          eq(drawerDetails.roadmapId, input.roadmapId),
          eq(drawerDetails.nodeName, input.nodeName)
        ),
      });

      if (savedNodeDetails) {
        return savedNodeDetails;
      }
      return null;
    }),

  getTotalGenerated: publicProcedure
    .query(async ({ ctx }) => {
      const [{ value: totalRoadmaps }] = await ctx.db
        .select({ value: count() })
        .from(roadmaps);
      return totalRoadmaps;
    }),
});
