import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export const POST = async (req: NextRequest) => {
  try {
    const apiKey = req.nextUrl.searchParams.get("apiKey");
    const roadmapId = req.nextUrl.searchParams.get("roadmapId");

    if (!roadmapId) {
      return NextResponse.json(
        { status: false, message: "Please send required params." },
        { status: 400 },
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });

    const body = await req.json();
    const query = body.query;
    const child = body.child;
    const parent = body.parent;

    if (!query || !child || !parent) {
      return NextResponse.json(
        { status: false, message: "Please send required params." },
        { status: 400 },
      );
    }

    const text = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      temperature: 1,
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant that can generate career/syllabus roadmap.`,
        },
        {
          role: "user",
          content: `a roadmap in JSON format has been generated related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: [{moduleName: string, moduleDescription: string, link?: string}]}} and i'd like to request a small description and wikipedia link on moduleName: ${child} from chapterName: ${parent} in JSON format: {description: string, link: string}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    let json: { description: string; link: string } | null = null;

    try {
      json = JSON.parse(text?.choices?.[0]?.message?.content || "");

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
