import { saveRoadmap } from "@/actions/roadmaps";
import { SanitiseJSON, capitalize } from "@/lib/utils";
import { ChatCohere } from "@langchain/cohere";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: Response) => {
  const apiKey = req.nextUrl.searchParams.get("apiKey");

  try {
    const body = await req.json();
    const query = body.query;

    if (!query) {
      return NextResponse.json(
        { status: false, message: "Please send query." },
        { status: 400 },
      );
    }

    if (!apiKey && !process.env.COHERE_API_KEY) {
      return NextResponse.json(
        { status: false, message: "Please provide API key." },
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
        "You are a helpful AI assistant that can generate career/syllabus roadmaps. You can arrange it in a way so that the order of the chapters is always from beginner to advanced. Always generate a minimum of 4 modules inside a chapter.",
      ],
      ["human", "{input}"],
    ]);
    const chain = prompt.pipe(model);
    const response = await chain.invoke({
      input: `Generate a roadmap in JSON format related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: string[]}}.`,
    });

    let json: any = {};
    try {
      json = JSON.parse(String(SanitiseJSON(response?.content)));
      const tree = [
        {
          name: capitalize(json.query),
          children: Object.keys(json.chapters).map((sectionName) => ({
            name: sectionName,
            children: json.chapters[sectionName].map((moduleName: string) => ({
              name: moduleName,
            })),
          })),
        },
      ];
      await saveRoadmap(query, tree);
      return NextResponse.json(
        { status: true, text: json, tree: tree },
        { status: 200 },
      );
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
