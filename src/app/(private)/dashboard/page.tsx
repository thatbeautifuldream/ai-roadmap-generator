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

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-lg font-semibold leading-8 text-gray-900">
          Your Roadmaps
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roadmaps.length > 0 &&
          roadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              title={roadmap.title}
              views={roadmap.views.toString()}
              timeAgo={timeFromNow(roadmap?.createdAt?.toString())}
              slug={roadmap.id}
              savedRoadmapId=""
            />
          ))}
        {roadmaps.length === 0 && (
          <div className="col-span-full flex justify-center">
            <EmptyAlert
              title="No roadmaps"
              description="You haven't created any roadmaps yet. Please create one to get started."
            />
          </div>
        )}
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold leading-8 text-gray-900">
          Saved Roadmaps
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedRoadmaps.length > 0 &&
          savedRoadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              title={roadmap.title}
              slug={roadmap.roadmapId}
              savedRoadmapId={roadmap.id}
              savedRoadmapCard
            />
          ))}
        {savedRoadmaps.length === 0 && (
          <div className="col-span-full flex justify-center">
            <EmptyAlert
              title="No saved roadmaps"
              description="You haven't saved any roadmaps yet. Please save one to get started."
            />
          </div>
        )}
      </div>
    </div>
  );
}
