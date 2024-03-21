'use server'
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getRoadmapsByUserId = async () => {
    const userId = await gerUserId() as string;
    const roadmaps = await db.roadmap.findMany({
        where: {
            userId,
        },
    });
    return roadmaps;
}

export const getRoadmapById = async (id: string) => {
    const userId = await gerUserId() as string;
    const roadmap = await db.roadmap.findUnique({
        where: {
            id
        }
    });
    return roadmap;
}

export const deleteRoadmapById = async (id: string) => {
    const userId = await gerUserId() as string;
    const roadmap = await db.roadmap.delete({
        where: {
            id
        }
    });
    return roadmap;
}

export const gerUserId = async () => {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        throw Error('UserId not found')
    }
    return userId;
}