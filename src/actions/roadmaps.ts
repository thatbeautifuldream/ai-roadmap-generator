"use server";
import { Node } from "@/lib/shared/types/common";
import { db } from "@/lib/db";
import {
  users,
  roadmaps,
  savedRoadmaps,
  drawerDetails,
  Visibility,
} from "@/db/schema";
import { eq, and, ilike, count, desc, sql } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export const getUserId = async () => {
  const userId = (await currentUser())?.id;
  return userId;
};

export const getRoadmapsByUserId = async () => {
  const userId = await getUserId();
  if (!userId) return [];

  const result = await db.query.roadmaps.findMany({
    where: eq(roadmaps.userId, userId),
  });
  return result;
};

export const getSavedRoadmapsByUserId = async () => {
  const userId = await getUserId();
  if (!userId) return [];

  const result = await db.query.savedRoadmaps.findMany({
    where: eq(savedRoadmaps.userId, userId),
  });
  return result;
};

export const getRoadmapById = async (id: string) => {
  const roadmap = await db.query.roadmaps.findFirst({
    where: eq(roadmaps.id, id),
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

    const [roadmap] = await db
      .insert(roadmaps)
      .values({
        userId,
        title,
        content: JSON.stringify(content),
      })
      .returning();

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
  await db
    .update(roadmaps)
    .set({
      searchCount: sql`${roadmaps.searchCount} + 1`,
    })
    .where(eq(roadmaps.id, roadmapId));
};

export const changeRoadmapVisibility = async (
  roadmapId: string,
  visibility: Visibility
) => {
  await db
    .update(roadmaps)
    .set({ visibility })
    .where(eq(roadmaps.id, roadmapId));
};

export const isRoadmapGeneratedByUser = async (roadmapId: string) => {
  const userId = await getUserId();

  const roadmap = await db.query.roadmaps.findFirst({
    where: eq(roadmaps.id, roadmapId),
    with: {
      author: true,
    },
  });

  const savedRoadmap = userId
    ? await db.query.savedRoadmaps.findFirst({
        where: and(
          eq(savedRoadmaps.userId, userId),
          eq(savedRoadmaps.roadmapId, roadmapId)
        ),
      })
    : null;

  return {
    isGeneratedByUser: roadmap?.userId === userId,
    isSavedByUser: !!savedRoadmap,
    isAuthor: roadmap?.author.id === userId,
  };
};

export const getPublicRoadmaps = async () => {
  const result = await db.query.roadmaps.findMany({
    where: eq(roadmaps.visibility, "PUBLIC"),
    with: {
      author: {
        columns: {
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy: desc(roadmaps.createdAt),
  });
  return result;
};

type PaginatedPublicRoadmap = {
  page: number;
  pageSize: number;
};

export const getPaginatedPublicRoadmaps = async ({
  page,
  pageSize,
}: PaginatedPublicRoadmap) => {
  const result = await db.query.roadmaps.findMany({
    where: eq(roadmaps.visibility, "PUBLIC"),
    with: {
      author: {
        columns: {
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy: desc(roadmaps.createdAt),
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });

  const [{ value: totalCount }] = await db
    .select({ value: count() })
    .from(roadmaps)
    .where(eq(roadmaps.visibility, "PUBLIC"));

  const pageCount = Math.ceil(totalCount / pageSize);

  return { roadmaps: result, pageCount };
};

export const checkIfTitleInUsersRoadmaps = async (title: string) => {
  const normalizedTitle = title.trim().toLowerCase().replace(/\s+/g, "");

  const roadmap = await db.query.roadmaps.findFirst({
    where: ilike(roadmaps.title, `%${normalizedTitle}%`),
  });

  if (roadmap && roadmap.visibility === "PUBLIC") {
    return { state: true, id: roadmap.id, title: roadmap.title };
  } else {
    return { state: false };
  }
};

export const incrementUserCredits = async () => {
  const userId = await getUserId();
  if (!userId) return;

  await db
    .update(users)
    .set({
      credits: sql`${users.credits} + 1`,
    })
    .where(eq(users.id, userId));
};

export const deleteRoadmapById = async (
  id: string
): Promise<{ status: string; message?: string }> => {
  const userId = await getUserId();

  const roadmap = await db.query.roadmaps.findFirst({
    where: eq(roadmaps.id, id),
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

  await db.delete(roadmaps).where(eq(roadmaps.id, id));

  return { status: "success", message: "Roadmap successfully deleted." };
};

export const deleteSavedRoadmapById = async (
  id: string
): Promise<{ status: string; message?: string }> => {
  const userId = await getUserId();

  const roadmap = await db.query.savedRoadmaps.findFirst({
    where: eq(savedRoadmaps.id, id),
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

  await db.delete(savedRoadmaps).where(eq(savedRoadmaps.id, id));

  return { status: "success", message: "Roadmap successfully deleted." };
};

export const increaseViewsByRoadmapId = async (id: string) => {
  const roadmap = await db.query.roadmaps.findFirst({
    where: eq(roadmaps.id, id),
  });

  if (!roadmap) {
    return;
  }

  await db
    .update(roadmaps)
    .set({
      views: sql`${roadmaps.views} + 1`,
    })
    .where(eq(roadmaps.id, id));
};

export const saveToUserDashboard = async (roadmapId: string) => {
  const userId = await getUserId();

  if (!userId) {
    return { status: "error", message: "Please sign in to save." };
  }

  const existingSavedRoadmap = await db.query.savedRoadmaps.findFirst({
    where: and(
      eq(savedRoadmaps.userId, userId),
      eq(savedRoadmaps.roadmapId, roadmapId)
    ),
  });

  if (existingSavedRoadmap) {
    return { status: "error", message: "Already saved." };
  }

  const roadmap = await db.query.roadmaps.findFirst({
    where: eq(roadmaps.id, roadmapId),
  });

  if (!roadmap) {
    return;
  }

  try {
    await db.insert(savedRoadmaps).values({
      userId,
      roadmapId,
      title: roadmap.title,
    });

    return {
      status: "success",
      message: "Roadmap saved successfully.",
    };
  } catch (error: unknown) {
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
  youtubeVideoIds: string[]
) => {
  try {
    const [savedDetail] = await db
      .insert(drawerDetails)
      .values({
        roadmapId,
        nodeName,
        details: content,
        youtubeVideoIds,
        books,
      })
      .returning();

    return savedDetail;
  } catch (error) {
    console.error("Error saving node details:", error);
    throw new Error("Failed to save node details");
  }
};

export const findSavedNodeDetails = async (
  roadmapId: string,
  nodeName: string
) => {
  if (!roadmapId || !nodeName) {
    throw new Error("Missing required parameters");
  }

  try {
    const savedNodeDetails = await db.query.drawerDetails.findFirst({
      where: and(
        eq(drawerDetails.roadmapId, roadmapId),
        eq(drawerDetails.nodeName, nodeName)
      ),
    });

    if (savedNodeDetails) {
      return savedNodeDetails;
    }
    return false;
  } catch (error) {
    console.error("Error finding saved node details:", error);
    throw new Error("Failed to find saved node details");
  }
};

export const getTotalRoadmapsGenerated = async () => {
  const [{ value: totalRoadmaps }] = await db
    .select({ value: count() })
    .from(roadmaps);
  return totalRoadmaps;
};
