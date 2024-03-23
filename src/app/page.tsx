import { auth } from "@/auth";
import MarqueeDemo from "@/components/ui/marque-wrapper";
import { db } from "@/lib/db";
import { ArrowUpRight, Wand } from "lucide-react";

export default function Home() {
  return (
    <>
      <RoadmapLanding />
    </>
  );
}

async function RoadmapLanding() {
  const session = await auth();
  const userId = session?.user?.id;
  let user: any = {};
  if (session) {
    user = await db.user.findUnique({
      where: { id: userId },
    });
  }
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
          <form className="flex w-full flex-col gap-2 sm:flex-row">
            <div className="relative w-full">
              <input
                autoFocus
                type="text"
                className="w-full rounded-md border border-gray-400 px-3 py-2.5 pr-8 transition-colors focus:border-black focus:outline-none"
                placeholder="Enter a topic to generate a roadmap for"
              />
            </div>
            <button className="flex min-w-[154px] flex-shrink-0 items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50">
              <span className="flex items-center gap-x-2 text-base">
                <Wand size={20} />
                Generate
              </span>
            </button>
          </form>
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
          <p className="text-center text-gray-500">
            You have generated{" "}
            <span className="inline-block min-w-[50px] rounded-xl border px-1.5 text-center text-sm tabular-nums text-gray-800">
              {Math.abs((5 - user?.credits))} out of 5
            </span>{" "}
            free roadmaps.
          </p>
          <p className="flex items-center text-sm">
            <button className="rounded-xl border border-current px-2 py-0.5 text-sm text-blue-500 transition-colors hover:bg-blue-400 hover:text-white">
              By-pass all limits by{" "}
              <span className="font-semibold">
                adding your own OpenAI API key
              </span>
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
