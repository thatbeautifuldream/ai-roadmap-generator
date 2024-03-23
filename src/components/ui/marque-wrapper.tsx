import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import Marquee from "./marquee";

const roadmaps = [
  {
    title: "Frontend",
    views: "1300",
    time: "15m ago",
  },
  {
    title: "Backend",
    views: "1750",
    time: "20m ago",
  },
  {
    title: "DevOps",
    views: "1425",
    time: "25m ago",
  },
  {
    title: "Machine Learning",
    views: "1885",
    time: "10m ago",
  },
  {
    title: "Data Science",
    views: "1555",
    time: "30m ago",
  },
  {
    title: "Mobile Development",
    views: "1670",
    time: "40m ago",
  },
  {
    title: "Web Development",
    views: "1950",
    time: "5m ago",
  },
  {
    title: "UI/UX Design",
    views: "1450",
    time: "35m ago",
  },
];

const firstRow = roadmaps.slice(0, roadmaps.length / 2);
const secondRow = roadmaps.slice(roadmaps.length / 2);

const ReviewCard = ({
  title,
  views,
  time,
}: {
  title: string;
  views: string;
  time: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded border-2 border-[#000000a6] p-2 shadow-[6px_6px_0px_1px_#000000a6] flex flex-col justify-between h-20"
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
  );
};

const MarqueeDemo = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg  bg-background md:shadow-2xl">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.time} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.time} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
};

export default MarqueeDemo;
