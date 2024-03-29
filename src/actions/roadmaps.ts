"use server";
import { Node } from "@/app/shared/types/common";
import { db } from "@/lib/db";
import { Visibility } from "@prisma/client";
import { currentUser } from "@clerk/nextjs";

export const getUserId = async () => {
  const userId = (await currentUser())?.id;
  return userId;
};

export const getRoadmapsByUserId = async () => {
  const userId = await getUserId();
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

export const saveRoadmap = async (title: string, content: Node[]) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      return {
        status: "error",
        error: "User not found",
      };
    }
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
  visibility: Visibility,
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

export const isRoadmapGeneratedByUser = async (roadmapId: string) => {
  const userId = await getUserId();
  const roadmap = await db.roadmap.findFirst({
    where: {
      id: roadmapId,
    },
  });

  if (roadmap?.userId === userId) return true;
  return false;
};

export const getPublicRoadmaps = async () => {
  const roadmaps = await db.roadmap.findMany({
    where: {
      visibility: Visibility.PUBLIC,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return roadmaps;
};

export const checkIfTitleInUsersRoadmaps = async (title: string) => {
  const normalizedTitle = title.trim().toLowerCase().replace(/\s+/g, "");

  const roadmap = await db.roadmap.findFirst({
    where: {
      title: {
        contains: normalizedTitle,
        mode: "insensitive", // This makes the search case-insensitive
      },
    },
  });

  if (roadmap && roadmap.visibility === Visibility.PUBLIC) {
    return { state: true, id: roadmap.id, title: roadmap.title };
  } else {
    return { state: false };
  }
};

export const incrementUserCredits = async () => {
  const userId = await getUserId();
  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      credits: {
        increment: 1,
      },
    },
  });
};

export const deleteRoadmapById = async (
  id: string,
): Promise<{ status: string; message?: string }> => {
  const userId = await getUserId();
  const roadmap = await db.roadmap.findUnique({
    where: {
      id,
    },
  });

  if (!roadmap) {
    return { status: "error", message: "Roadmap not found." };
  }

  if (roadmap.userId !== userId) {
    return {
      status: "error",
      message: "User does not have permission to delete this roadmap.",
    };
  }

  await db.roadmap.delete({
    where: {
      id,
    },
  });

  return { status: "success", message: "Roadmap successfully deleted." };
};

export const increaseViewsByRoadmapId = async (id: string) => {
  const roadmap = await db.roadmap.findUnique({
    where: {
      id,
    },
  });

  if (!roadmap) {
    return;
  }

  await db.roadmap.update({
    where: {
      id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });
};

export const saveToUserDashboard = async (roadmapId: string) => {
  const userId = await getUserId();

  if (!userId) {
    return;
  }

  try {
    await db.savedRoadmap.create({
      data: {
        userId,
        roadmapId,
      },
    });
    return {
      status: "success",
    };
  } catch (error: any) {
    console.log(error);
    return {
      status: "error",
    };
  }
};
