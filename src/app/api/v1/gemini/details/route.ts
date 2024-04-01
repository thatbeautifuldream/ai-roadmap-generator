import { SanitiseJSON } from "@/lib/utils";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const apiKey = req.nextUrl.searchParams.get("apiKey");
    const roadmapId = req.nextUrl.searchParams.get("roadmapId");
    const body = await req.json();
    const query = body.query;
    const child = body.child;
    const parent = body.parent;

    if (!roadmapId) {
      return NextResponse.json(
        { status: false, message: "Please send required params." },
        { status: 400 },
      );
    }

    if (!query || !child || !parent) {
      return NextResponse.json(
        { status: false, message: "Please send required params." },
        { status: 400 },
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
        "You are a helpful AI assistant that can generate career/syllabus roadmap.",
      ],
      [
        "human",
        `a roadmap in JSON format has been generated related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: [{moduleName: string, moduleDescription: string, link?: string}]}} and i'd like to request a small description and wikipedia link on moduleName: ${child} from chapterName: ${parent} in JSON format: {description: string, link: string}`,
      ],
    ]);
    let json: { description: string; link: string } | null = null;

    try {
      json = JSON.parse(SanitiseJSON(String(response.content)) || "");

      if (!json) {
        return NextResponse.json(
          {
            status: false,
            message: "Error parsing roadmap data.",
          },
          { status: 500 },
        );
      }
      return NextResponse.json({ status: true, text: json }, { status: 200 });
    } catch (e) {
      console.log(e);
      return NextResponse.json(
        {
          status: false,
          message: "Error parsing roadmap data.",
        },
        { status: 500 },
      );
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { status: false, message: "Something went wrong." },
      { status: 400 },
    );
  }
};
