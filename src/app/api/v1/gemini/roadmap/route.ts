import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { capitalize } from "@/lib/utils";

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const query = body.query;
    if (!query) {
      return NextResponse.json(
        { status: false, message: "Please send query." },
        { status: 400 }
      );
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
        "You are a helpful AI assistant that can generate career/syllabus roadmaps. You can arrange it in a way so that the order of the chapters is always from beginner to advanced. Always generate a minimum of 4 modules inside a chapter.",
      ],
      [
        "human",
        `Generate a roadmap in JSON format related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: string[]}} not in mardown format containing backticks.`,
      ],
    ]);
    let json: any = null;
    try {
      json = JSON.parse(String(response?.content));
      const tree = [
        {
          name: capitalize(json.query),
          children: Object.keys(json.chapters).map((sectionName) => ({
            name: sectionName,
            children: json.chapters[sectionName].map(({ moduleName, link, moduleDescription }: { moduleName: string, link: string, moduleDescription: string }) => ({
              name: moduleName,
              moduleDescription,
              link,
            })),
          })),
        },
      ];
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
