import {
  incrementRoadmapSearchCount,
  incrementUserCredits,
  saveRoadmap,
} from "@/actions/roadmaps";
import { decrementCreditsByUserId } from "@/actions/users";
import { Node } from "@/lib/shared/types/common";
import { db } from "@/lib/db";
import { roadmaps } from "@/db/schema";
import { ilike } from "drizzle-orm";
import { capitalize } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { getModel, type Provider } from "@/lib/ai";
import { roadmapSchema } from "@/lib/ai/schemas";

const SYSTEM_PROMPT = `You are a helpful AI assistant that can generate career/syllabus roadmap. You can arrange it in a way so that the order of the chapters is always from beginner to advanced. Always generate a minimum of 4 modules inside a chapter, link to wikipedia if possible. PLEASE REFRAIN FROM GENERATING ANY OBSCENE CONTENT AS THIS PLATFORM IS A LEARNING PLATFORM.`;

export const POST = async (req: NextRequest) => {
  try {
    const provider = (req.nextUrl.searchParams.get("provider") ||
      "openai") as Provider;
    const apiKey = req.nextUrl.searchParams.get("apiKey");
    const body = await req.json();
    const query = body.query;

    if (!query) {
      return NextResponse.json(
        { status: false, message: "Please send query." },
        { status: 400 }
      );
    }

    // Check for existing roadmap
    const normalizedQuery = query.replace(/\s+/g, "").toLowerCase();
    const alreadyExists = await db.query.roadmaps.findMany({
      where: ilike(roadmaps.title, `%${normalizedQuery}%`),
    });

    if (alreadyExists.length > 0) {
      await incrementRoadmapSearchCount(alreadyExists[0].id);
      const tree = JSON.parse(alreadyExists[0].content);
      return NextResponse.json(
        { status: true, tree, roadmapId: alreadyExists[0].id },
        { status: 200 }
      );
    }

    // Get AI model based on provider
    const model = getModel(provider, apiKey);

    // Generate roadmap using AI SDK
    const { object: json } = await generateObject({
      model,
      schema: roadmapSchema,
      system: SYSTEM_PROMPT,
      prompt: `Generate a roadmap in JSON format related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: [{moduleName: string, moduleDescription: string, link?: string}]}}`,
    });

    // Decrement credits if no API key provided
    if (!apiKey) {
      try {
        const creditsRemaining = await decrementCreditsByUserId();
        if (!creditsRemaining) {
          return NextResponse.json(
            {
              status: false,
              message: "No credits remaining",
            },
            { status: 400 }
          );
        }
      } catch (e) {
        await incrementUserCredits();
        console.log(e);
        return NextResponse.json(
          {
            status: false,
            message: "An error occurred while managing credits.",
          },
          { status: 500 }
        );
      }
    }

    // Transform to tree structure
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

    const { data } = await saveRoadmap(query, tree);

    return NextResponse.json(
      { status: true, text: json, tree, roadmapId: data?.id },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        status: false,
        message:
          "An unexpected error occurred while generating roadmap. Please try again or use a different keyword/query.",
      },
      { status: 400 }
    );
  }
};
