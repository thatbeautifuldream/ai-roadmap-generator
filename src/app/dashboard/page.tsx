import {
  getRoadmapsByUserId,
  getSavedRoadmapsByUserId,
} from "@/actions/roadmaps";
import { EmptyAlert } from "@/components/alerts/EmptyAlert";
import RoadmapCard from "@/components/flow-components/roadmap-card";
import { timeFromNow } from "@/lib/utils";

export default async function Dashboard() {
  const roadmaps = await getRoadmapsByUserId();
  const savedRoadmaps = await getSavedRoadmapsByUserId();
  const combinedRoadmaps = [...roadmaps, ...savedRoadmaps];

  combinedRoadmaps.sort((a, b) => {
    return (
      new Date(b?.createdAt?.toString()).getTime() -
      new Date(a?.createdAt?.toString()).getTime()
    );
  });

  console.log("combinedRoadmaps", combinedRoadmaps);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
        Your Roadmaps
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {combinedRoadmaps.length > 0 ? (
          combinedRoadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              title={roadmap.title}
              views={roadmap.views.toString()}
              timeAgo={timeFromNow(roadmap?.createdAt?.toString())}
              slug={roadmap.id}
            />
          ))
        ) : (
          <EmptyAlert description="You haven't created any roadmaps yet. Please create one to get started." />
        )}
      </div>
    </div>
  );
}
