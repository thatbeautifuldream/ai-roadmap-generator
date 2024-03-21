"use server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export const saveRoadmap = async (title: string, content: any) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return;

    const roadmap = await db.roadmap.create({
      data: {
        userId,
        title,
        content: JSON.stringify(content),
      },
    });

    return {
      status: "success",
      data: roadmap,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};
