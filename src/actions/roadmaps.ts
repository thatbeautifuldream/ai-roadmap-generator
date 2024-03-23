"use server";
import { Node } from "@/app/shared/types/common";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getRoadmapsByUserId = async () => {
  const userId = (await getUserId()) as string;
  const roadmaps = await db.roadmap.findMany({
    where: {
      userId,
    },
  });
  return roadmaps;
};

export const getRoadmapById = async (id: string) => {
  const roadmap = await db.roadmap.findUnique({
    where: {
      id,
    },
  });
  return roadmap;
};

export const deleteRoadmapById = async (id: string) => {
  const roadmap = await db.roadmap.delete({
    where: {
      id,
    },
  });
  return roadmap;
};

export const saveRoadmap = async (title: string, content: Node[]) => {
  try {
    const userId = (await getUserId()) as string;
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

export const getUserId = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw Error("UserId not found");
  }
  return userId;
};

export const incrementRoadmapSearchCount = async (roadmapId: string) => {
  await db.roadmap.update({
    where: {
      id: roadmapId,
    },
    data: {
      searchCount: {
        increment: 1,
      },
    },
  });
};

export const changeRoadmapVisibility = async (
  roadmapId: string,
  visibility: "PUBLIC" | "PRIVATE",
) => {
  await db.roadmap.update({
    where: {
      id: roadmapId,
    },
    data: {
      visibility,
    },
  });
};
