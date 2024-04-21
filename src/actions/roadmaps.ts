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

export const getSavedRoadmapsByUserId = async () => {
  const userId = await getUserId();
  const roadmaps = await db.savedRoadmap.findMany({
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
    include: {
      author: true,
    },
  });

  const savedRoadmap = await db.savedRoadmap.findFirst({
    where: {
      userId,
      roadmapId,
    },
  });

  return {
    isGeneratedByUser: roadmap?.userId === userId,
    isSavedByUser: !!savedRoadmap,
    isAuthor: roadmap?.author.id === userId,
  };
};

export const getPublicRoadmaps = async () => {
  const roadmaps = await db.roadmap.findMany({
    where: {
      visibility: Visibility.PUBLIC,
    },
    include: {
      author: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return roadmaps;
};

export const getPaginatedPublicRoadmaps = async (page = 1, pageSize = 18) => {
  const [total, roadmaps] = await Promise.all([
    db.roadmap.count({
      where: {
        visibility: Visibility.PUBLIC,
      },
    }),
    db.roadmap.findMany({
      where: {
        visibility: Visibility.PUBLIC,
      },
      include: {
        author: {
          select: {
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    page,
    pageSize,
    total,
    roadmaps,
  };
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

export const deleteSavedRoadmapById = async (
  id: string,
): Promise<{ status: string; message?: string }> => {
  const userId = await getUserId();
  const roadmap = await db.savedRoadmap.findUnique({
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

  await db.savedRoadmap.delete({
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
    return { status: "error", message: "Please sign in to save." };
  }

  const existingSavedRoadmap = await db.savedRoadmap.findFirst({
    where: {
      userId,
      roadmapId,
    },
  });

  if (existingSavedRoadmap) {
    return { status: "error", message: "Already saved." };
  }

  const roadmap = await db.roadmap.findUnique({
    where: {
      id: roadmapId,
    },
  });

  if (!roadmap) {
    return;
  }

  try {
    await db.savedRoadmap.create({
      data: {
        userId,
        roadmapId,
        title: roadmap.title,
      },
    });
    return {
      status: "success",
      message: "Roadmap saved successfully.",
    };
  } catch (error: any) {
    console.log(error);
    return {
      status: "error",
    };
  }
};

export const saveNodeDetails = async (
  roadmapId: string,
  nodeName: string,
  content: string,
  books: string,
  youtubeVideoIds: string[],
) => {
  try {
    const savedDetails = await db.roadmap.update({
      where: { id: roadmapId },
      data: {
        drawerDetails: {
          create: {
            nodeName,
            details: content,
            youtubeVideoIds,
            books,
          },
        },
      },
    });
    return savedDetails;
  } catch (error) {
    console.error("Error saving node details:", error);
    throw new Error("Failed to save node details");
  }
};

export const findSavedNodeDetails = async (
  roadmapId: string,
  nodeName: string,
) => {
  if (!roadmapId || !nodeName) {
    throw new Error("Missing required parameters");
  }
  try {
    const savedNodeDetails = await db.roadmap.findUnique({
      where: { id: roadmapId },
      include: {
        drawerDetails: {
          where: { nodeName },
        },
      },
    });
    if (savedNodeDetails!.drawerDetails.length > 0) {
      return savedNodeDetails!.drawerDetails[0];
    }
    return false;
  } catch (error) {
    console.error("Error finding saved node details:", error);
    throw new Error("Failed to find saved node details");
  }
};
