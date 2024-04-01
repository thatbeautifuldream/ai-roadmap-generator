import { JSONType } from "@/lib/types";
import { SanitiseJSON } from "@/lib/utils";
import { ChatCohere } from "@langchain/cohere";
import { ChatPromptTemplate } from "@langchain/core/prompts";
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

    const model = new ChatCohere({
      apiKey: apiKey || process.env.COHERE_API_KEY,
      model: "command",
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "ai",
        "You are a helpful AI assistant that can generate career/syllabus roadmap. ",
      ],
      ["human", "{input}"],
    ]);
    const chain = prompt.pipe(model);
    const response = await chain.invoke({
      input: `A roadmap in JSON format has been generated related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: [{moduleName: string, moduleDescription: string, link?: string}]}} and i'd like to request a small description in markdown format and as bullet points (minimum 5) and wikipedia link on moduleName: ${child} from chapterName: ${parent} in JSON format: {description: string, link: string, bulletPoints: string[]}`,
    });

    let json: JSONType | null = null;

    try {
      const data = SanitiseJSON(String(response?.content));
      json = JSON.parse(data);

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
