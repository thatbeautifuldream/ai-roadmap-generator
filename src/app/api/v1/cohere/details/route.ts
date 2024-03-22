import { SanitiseJSON } from "@/lib/utils";
import { ChatCohere } from "@langchain/cohere";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
  try {
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

    const model = new ChatCohere({
      apiKey: process.env.COHERE_API_KEY,
      model: "command",
    });

    // const prompt = ChatPromptTemplate.fromMessages([
    //   [
    //     "ai",
    //     `You are a helpful AI assistant that can generate career/syllabus roadmap. a roadmap in JSON format has been generated related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: [{moduleName: string, moduleDescription: string, link?: string}]}} and i'd like to request a small description and wikipedia link on moduleName: ${child} from chapterName: ${parent} in JSON format: {description: string, link: string}`,
    //   ],
    //   ["human", "{input}"],
    // ]);

    // const chain = prompt.pipe(model);

    // let json: any = {};

    // const response = await chain.invoke({
    //   input: `Generate a roadmap in JSON format related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: string[]}}.`,
    // });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "ai",
        "You are a helpful AI assistant that can generate career/syllabus roadmap. ",
      ],
      ["human", "{input}"],
    ]);
    const chain = prompt.pipe(model);
    const response = await chain.invoke({
      input: `a roadmap in JSON format has been generated related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: [{moduleName: string, moduleDescription: string, link?: string}]}} and i'd like to request a small description and wikipedia link on moduleName: ${child} from chapterName: ${parent} in JSON format: {description: string, link: string}`,
    });

    let json: any = {};

    try {
      const data = SanitiseJSON(String(response?.content));
      console.log(typeof data);

      json = JSON.parse(data);

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
