import { db } from "@/lib/db";
import { auth } from "@/auth";

const dashboard = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  console.log(userId);
  const roadmaps = await db.roadmap.findMany({
    where: {
      userId,
    },
  });
  console.log(roadmaps);
  return <h1>{JSON.stringify(roadmaps)}</h1>;
};

export default dashboard;
