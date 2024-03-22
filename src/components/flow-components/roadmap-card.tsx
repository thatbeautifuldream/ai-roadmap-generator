import { EyeIcon } from "@/app/shared/Icons";
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

export default RoadmapCard;
