import { getRoadmapsByUserId } from "@/actions/roadmaps";
import { EmptyAlert } from "@/components/alerts/EmptyAlert";
import { timeFromNow } from "@/lib/utils";
import Link from "next/link";
import { EyeIcon } from "../shared/Icons";

function RoadmapCard({
  title,
  views,
  timeAgo,
  slug,
}: {
  title?: string;
  views?: string;
  timeAgo?: string;
  slug?: string;
}) {
  return (
    <>
      <Link
        href={`/roadmap/${slug}`}
        className="flex flex-col rounded-md border transition-colors hover:bg-gray-100"
        style={{ maxHeight: "150px", overflow: "hidden" }}
      >
        <h2 className="flex-grow px-2.5 py-2.5 text-base font-medium leading-tight">
          {title}
        </h2>
        <div className="flex items-center justify-between gap-2 px-2.5 py-2">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <EyeIcon />
            {views}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            {timeAgo}
          </span>
        </div>
      </Link>
    </>
  );
}

export default async function Dashboard() {
  const roadmaps = await getRoadmapsByUserId();
  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
  await wait(5000);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
        Your Roadmaps
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roadmaps.length > 0 ? (
          roadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              title={roadmap.title}
              views="2 views"
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
