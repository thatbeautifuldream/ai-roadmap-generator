import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const body = await req.json();
    const searchString = body.query;
    const searchResults = await db.roadmap.findMany({
      where: {
        title: {
          contains: searchString,
        },
        visibility: "PUBLIC",
      },
    });

    return NextResponse.json(
      { status: true, data: searchResults },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { status: false, message: "bad reqe" },
      { status: 500 },
    );
  }
};
