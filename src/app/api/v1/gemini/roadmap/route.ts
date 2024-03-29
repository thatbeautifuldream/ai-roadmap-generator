import {
  incrementRoadmapSearchCount,
  incrementUserCredits,
  saveRoadmap,
} from "@/actions/roadmaps";
import { decrementCreditsByUserId } from "@/actions/users";
import { db } from "@/lib/db";
import { JSONType } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: Response) => {
  try {
    const apiKey = req.nextUrl.searchParams.get("apiKey");

    const body = await req.json();
    const query = body.query;
    if (!query) {
      return NextResponse.json(
        { status: false, message: "Please send query." },
        { status: 400 }
      );
    }
    if (!apiKey && !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { status: false, message: "Please provide API key." },
        { status: 400 }
      );
    }
    const normalizedQuery = query.replace(/\s+/g, "").toLowerCase();

    const roadmaps = await db.roadmap.findMany({
      where: {
        title: {
          mode: "insensitive", // This line is optional and depends on your database
          contains: normalizedQuery,
        },
      },
    });
    const alreadyExists = roadmaps.find(
      (roadmap) =>
        roadmap.title.replace(/\s+/g, "").toLowerCase() === normalizedQuery
    );

    if (alreadyExists) {
      await incrementRoadmapSearchCount(alreadyExists.id); // does not return roadmapID to redirect
      const tree = JSON.parse(alreadyExists.content);
      return NextResponse.json(
        { status: true, tree, roadmapId: alreadyExists.id },
        { status: 200 }
      );
    }

    const model = new ChatGoogleGenerativeAI({
      modelName: "gemini-pro",
      maxOutputTokens: 2048,
      apiKey: apiKey || process.env.GEMINI_API_KEY,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
    });

    const response = await model.invoke([
      [
        "system",
        "You are a helpful AI assistant that can generate career/syllabus roadmaps. You can arrange it in a way so that the order of the chapters is always from beginner to advanced. Always generate a minimum of 4 modules inside a chapter and a link to wikipedia if possible",
      ],
      [
        "human",
        `Generate a roadmap in JSON format related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: [{moduleName: string, moduleDescription: string, link?: string}]}} not in mardown format containing backticks. IMPORTANT: REFRAIN FROM ANSWERING ANY NSFW/DESTRUCTIVE/PROFANITY QUERY.`,
      ],
    ]);
    if (!apiKey) {
      try {
        const creditsRemaining = await decrementCreditsByUserId();
        if (!creditsRemaining) {
          return NextResponse.json(
            {
              status: true,
              message: "No credits remaining ",
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
    let json: JSONType | null = null;

    try {
      json = JSON.parse(String(response?.content));
      if (!json) {
        return NextResponse.json(
          {
            status: false,
            message:
              "An unexpected error occurred while generating roadmap. Please try again or use a different keyword/query.",
          },
          { status: 500 }
        );
      }
      const tree = [
        {
          name: capitalize(json.query),
          children: Object.keys(json.chapters).map((sectionName) => ({
            name: sectionName,
            children: json?.chapters[sectionName].map(
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
        { status: 500 }
      );
    }
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
