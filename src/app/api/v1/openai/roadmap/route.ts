import { incrementRoadmapSearchCount, saveRoadmap } from "@/actions/roadmaps";
import { decrementCreditsByUserId } from "@/actions/users";
import { Node } from "@/app/shared/types/common";
import { db } from "@/lib/db";
import { JSONType } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "MY_API_KEY",
});

export const POST = async (req: NextRequest, res: Response) => {
  try {
    const apiKey = req.nextUrl.searchParams.get("apiKey");
    const body = await req.json();
    const query = body.query;
    if (!query) {
      return NextResponse.json(
        { status: false, message: "Please send query." },
        { status: 400 },
      );
    }
    if (!apiKey && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { status: false, message: "Please provide API key." },
        { status: 400 },
      );
    }
    const alreadyExists = await db.roadmap.findUnique({
      where: {
        title: query,
      },
    });

    if (alreadyExists) {
      await incrementRoadmapSearchCount(alreadyExists.id);
      const tree = JSON.parse(alreadyExists.content);
      return NextResponse.json({ status: true, tree }, { status: 200 });
    }

    const text = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      temperature: 1,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant that can generate career/syllabus roadmap. you can arrange it in a way so that the order of the chapters is always from beginner to advanced. always generate a minimum of 4 modules inside a chapter, link to wikipedia if possible",
        },
        {
          role: "user",
          // "content": `Generate a roadmap in JSON format related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: string[]}}`
          content: `Generate a roadmap in JSON format related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: [{moduleName: string, moduleDescription: string, link?: string}]}}`,
        },
      ],
      response_format: { type: "json_object" },
    });
    if (!apiKey) {
      const creditsRemaining = await decrementCreditsByUserId();
      if (!creditsRemaining) {
        return NextResponse.json(
          {
            status: true,
            message: "No credits remaining ",
          },
          { status: 400 },
        );
      }
    }
    let json: JSONType | null = null;

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
      const tree: Node[] = [
        {
          name: capitalize(json.query),
          children: Object.keys(json.chapters).map((sectionName) => ({
            name: sectionName,
            children: json?.chapters?.[sectionName]?.map(
              ({ moduleName, link, moduleDescription }) => ({
                name: moduleName,
                moduleDescription,
                link,
              }),
            ),
          })),
        },
      ];
      const { data } = await saveRoadmap(query, tree);
      return NextResponse.json(
        { status: true, text: json, tree, roadmapId: data?.id },
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
