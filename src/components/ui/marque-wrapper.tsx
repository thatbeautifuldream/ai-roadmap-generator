import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import Marquee from "./marquee";
import Link from "next/link";

type Roadmap = {
  title: string;
  views: string;
  time: string;
  id: string;
};

const roadmaps: Roadmap[] = [
  {
    title: "Frontend",
    views: "1300",
    time: "15m ago",
    id: "cluik00o6001lye79osk1301z",
  },
  {
    title: "Backend",
    views: "1750",
    time: "20m ago",
    id: "clurujwhu0001kazci4f6tt94",
  },
  {
    title: "DevOps",
    views: "1425",
    time: "25m ago",
    id: "cluk5chyp001y14ic095xp3nz",
  },
  {
    title: "Machine Learning",
    views: "1885",
    time: "10m ago",
    id: "clupklkxg0012ej06fsx0gxui",
  },
  {
    title: "Data Science",
    views: "1555",
    time: "30m ago",
    id: "clupkmei70015ej06rdjxgpg9",
  },
  {
    title: "Mobile Development",
    views: "1670",
    time: "40m ago",
    id: "clupknaun0018ej06vtruin2o",
  },
  {
    title: "Web Development",
    views: "1950",
    time: "5m ago",
    id: "clupkrst2001bej06xmpjlbs2",
  },
  {
    title: "UI/UX Design",
    views: "1450",
    time: "35m ago",
    id: "clupksg88001eej06cd7eci6d",
  },
];

const firstRow = roadmaps.slice(0, roadmaps.length / 2);
const secondRow = roadmaps.slice(roadmaps.length / 2);

const ReviewCard = ({ title, views, time, id }: Roadmap) => {
  return (
    <Link href={`/roadmap/${id}`} prefetch={false}>
      <figure
        className={cn(
          "relative w-48 sm:w-64 cursor-pointer overflow-hidden rounded border-2 border-[#000000a6] p-2 shadow-[6px_6px_0px_1px_#000000a6] flex flex-col justify-between h-20"
        )}
      >
        <p className="font-semibold">{title}</p>
        <div className="flex justify-between text-xs text-slate-500">
          <div className="flex gap-1 items-center">
            <Eye size={14} />
            {views}
          </div>
          <span>{time}</span>
        </div>
      </figure>
    </Link>
  );
};

const MarqueeDemo = () => {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-2xl mx-auto max-w-screen-xl">
      <Marquee pauseOnHover className="[--duration:20s] w-full">
        {firstRow.map((review) => (
          <ReviewCard key={review.time} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s] w-full">
        {secondRow.map((review) => (
          <ReviewCard key={review.time} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 md:w-1/3 w-[60px] bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 md:w-1/3 w-[60px] bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
};

export default MarqueeDemo;
