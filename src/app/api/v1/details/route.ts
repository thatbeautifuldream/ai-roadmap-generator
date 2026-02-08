import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { getModel, type Provider } from "@/lib/ai";
import { detailsSchema } from "@/lib/ai/schemas";

const SYSTEM_PROMPT = `You are a helpful AI assistant that can generate career/syllabus roadmap.`;

export const POST = async (req: NextRequest) => {
  try {
    const provider = (req.nextUrl.searchParams.get("provider") ||
      "openai") as Provider;
    const apiKey = req.nextUrl.searchParams.get("apiKey");
    const roadmapId = req.nextUrl.searchParams.get("roadmapId");

    if (!roadmapId) {
      return NextResponse.json(
        { status: false, message: "Please send required params." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const query = body.query;
    const child = body.child;
    const parent = body.parent;

    if (!query || !child || !parent) {
      return NextResponse.json(
        { status: false, message: "Please send required params." },
        { status: 400 }
      );
    }

    const model = getModel(provider, apiKey);

    const { object: json } = await generateObject({
      model,
      schema: detailsSchema,
      system: SYSTEM_PROMPT,
      prompt: `A roadmap in JSON format has been generated related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: [{moduleName: string, moduleDescription: string, link?: string}]}} and I'd like to request a small description, wikipedia link, and bullet points on moduleName: ${child} from chapterName: ${parent} in JSON format: {description: string, link: string, bulletPoints: string[]}`,
    });

    return NextResponse.json({ status: true, text: json }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { status: false, message: "Something went wrong." },
      { status: 400 }
    );
  }
};
