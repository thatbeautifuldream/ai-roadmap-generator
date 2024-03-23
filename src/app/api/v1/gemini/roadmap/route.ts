import { incrementRoadmapSearchCount, saveRoadmap } from "@/actions/roadmaps";
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
    if (!apiKey && !process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { status: false, message: "Please provide API key." },
        { status: 400 },
      );
    }
    const alreadyExists = await db.roadmap.findUnique({
      where: {
        title: query
      }
    })

    if (alreadyExists) {
      await incrementRoadmapSearchCount(alreadyExists.id)
      const tree = JSON.parse(alreadyExists.content);
      return NextResponse.json({ status: true, tree }, { status: 200 });
    }


    const model = new ChatGoogleGenerativeAI({
      modelName: "gemini-pro",
      maxOutputTokens: 2048,
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
        `Generate a roadmap in JSON format related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: [{moduleName: string, moduleDescription: string, link?: string}]}} not in mardown format containing backticks.`,
      ],
    ]);
    if (!apiKey) {
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
    }
    let json: JSONType | null = null;

    try {
      json = JSON.parse(String(response?.content));
      if (!json) {
        return NextResponse.json(
          {
            status: false,
            message: "Error parsing roadmap data.",
          },
          { status: 500 }
        );
      }
      const tree = [
        {
          name: capitalize(json.query),
          children: Object.keys(json.chapters).map((sectionName) => ({
            name: sectionName,
            children: json?.chapters[sectionName].map(({ moduleName, link, moduleDescription }) => ({
              name: moduleName,
              moduleDescription,
              link,
            })),
          })),
        },
      ];
      await saveRoadmap(query, tree)
      return NextResponse.json({ status: true, text: json, tree }, { status: 200 });
    } catch (e) {
      console.log(e);
      return NextResponse.json(
        {
          status: false,
          message: "Error parsing roadmap data.",
        },
        { status: 500 }
      );
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { status: false, message: "Something went wrong." },
      { status: 400 }
    );
  }
};
