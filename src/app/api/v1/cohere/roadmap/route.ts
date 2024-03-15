import { NextResponse } from "next/server";
import { ChatCohere } from "@langchain/cohere";
import { ChatPromptTemplate } from "@langchain/core/prompts";

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
    const model = new ChatCohere({
      apiKey: process.env.COHERE_API_KEY,
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
    console.log("response", response);

    let json = {};
    try {
      json = JSON.parse(String(SanitiseJSON(response?.content)));
      return NextResponse.json({ status: true, text: json }, { status: 200 });
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

function SanitiseJSON(text: any) {
  // ugly hack to remove the first and last part of response to get the JSON
  const json = text.split("```json")[1].split("```")[0];
  return json;
}
