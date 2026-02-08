import { db } from "@/lib/db";
import { roadmaps } from "@/db/schema";
import { ilike, and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const searchString = body.query;

    const searchResults = await db.query.roadmaps.findMany({
      where: and(
        ilike(roadmaps.title, `%${searchString}%`),
        eq(roadmaps.visibility, "PUBLIC")
      ),
    });

    return NextResponse.json(
      { status: true, data: searchResults },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { status: false, message: "bad request" },
      { status: 500 }
    );
  }
};
