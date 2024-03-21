import { getRoadmapsByUserId } from "@/actions/roadmaps";
import { timeFromNow } from "@/lib/utils";
import Link from "next/link";

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-eye inline-block"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
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

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
        Your Roadmaps
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roadmaps.map((roadmap) => (
          <RoadmapCard
            key={roadmap.id}
            title={roadmap.title}
            views="2 views"
            timeAgo={timeFromNow(roadmap.createdAt.toString())}
            slug={roadmap.id}
          />
        ))}
      </div>
    </div>
  );
}
