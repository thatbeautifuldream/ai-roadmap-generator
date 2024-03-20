import { db } from "@/lib/db";

export const getRoadmapsByUserId = async (userId: string) => {
  const roadmaps = await db.roadmap.findMany({
    where: {
      userId,
    },
  });

  return roadmaps;
};
