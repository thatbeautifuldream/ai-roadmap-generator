import { buttonVariants } from "@/components/ui/button";
import MarqueeDemo from "@/components/ui/marque-wrapper";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Telescope, Wand } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <RoadmapLanding />
    </>
  );
}

async function RoadmapLanding() {
  const trendyRoadmaps = [
    "Backend",
    "Frontend",
    "Fullstack",
    "Machine Learning",
  ];

  return (
    <>
      <div className="flex flex-grow flex-col items-center px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-0 text-center sm:gap-1 md:mt-6 lg:mt-32">
          <h1 className="relative text-4xl font-bold sm:text-3xl">
            <span className="hidden sm:inline">Generate roadmaps with AI</span>
            <span className="inline sm:hidden">AI Roadmap Generator</span>
          </h1>
          <p className="text-base text-gray-500 sm:text-lg">
            <span className="hidden sm:inline">
              Enter a topic and let the AI generate a roadmap for you
            </span>
            <span className="inline sm:hidden">
              Enter a topic to generate a roadmap
            </span>
          </p>
        </div>
        <div className="my-3 mt-6 flex w-full max-w-[600px] flex-col items-center gap-3 sm:my-5">
          <div className="flex flex-row gap-x-2">
            <Link
              href="/roadmap"
              className={cn(
                buttonVariants(),
                "flex min-w-[154px] flex-shrink-0 items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              <span className="flex items-center gap-x-2 text-base">
                <Wand size={20} />
                Generate
              </span>
            </Link>
            <Link
              href="/explore"
              className={cn(
                buttonVariants({}),
                "flex min-w-[154px] flex-shrink-0 items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              <span className="flex items-center gap-x-2 text-base">
                <Telescope size={20} />
                Explore
              </span>
            </Link>
          </div>
          <div className="flex flex-row flex-wrap items-center justify-center gap-2">
            {/* TODO : Add trendy topic from the database */}
            {trendyRoadmaps.map((trendyTopic) => (
              <button
                key={trendyTopic}
                type="button"
                className="flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-sm transition-colors hover:border-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {trendyTopic}
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="flex items-center text-sm">
            <button className="rounded-xl border border-current px-2 py-0.5 text-sm text-blue-500 transition-colors hover:bg-blue-400 hover:text-white">
              By-pass all limits by{" "}
              <span className="font-semibold">adding your own API key</span>
            </button>
          </p>
        </div>
        <div className="overflow-hidden max-w-6xl h-64">
          <MarqueeDemo />
        </div>
      </div>
    </>
  );
}
