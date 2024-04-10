import DotPattern from "@/components/ui/dot-pattern";
import { buttonVariants } from "@/components/ui/button";
import MarqueeDemo from "@/components/ui/marque-wrapper";
import { cn } from "@/lib/utils";
import { clerkClient } from "@clerk/nextjs";
import { ArrowUpRight, Telescope, Wand } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function UserAvatars() {
  const users = await clerkClient.users.getUserList();
  return (
    <>
      <div className="isolate flex -space-x-2 overflow-hidden">
        {users.map((user) => (
          <img
            key={user.id}
            className="relative z-30 inline-block h-8 w-8 rounded-full ring-2 ring-white"
            src={user.imageUrl}
            alt=""
          />
        ))}
      </div>
    </>
  );
}

export default function RoadmapHero() {
  const trendyRoadmaps = {
    Backend: "cluqobxvs003shc0agvoh0f50",
    Frontend: "cluik00o6001lye79osk1301z",
    "Web 3": "cluik0y12001oye79i3mq6s0q",
    "Machine Learning": "clupklkxg0012ej06fsx0gxui",
  };

  return (
    <div className="flex flex-grow flex-col items-center px-8 py-3 sm:px-5 overflow-hidden">
      <div className="flex flex-col gap-0 text-center sm:gap-1 sm:mt-6 md:mt-8 lg:mt-12">
        <Link
          href="https://peerlist.io/milind/project/ai-roadmap-generator"
          target="_blank"
        >
          <Image
            src="./images/launch-badge.svg"
            alt="Launch Badge"
            className="mx-auto mb-4"
            width={200}
            height={150}
          />
        </Link>
        <h1 className="relative text-4xl font-bold sm:text-3xl">
          <span className="hidden sm:inline">
            Curate Learning Roadmaps with AI
          </span>
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
          {Object.entries(trendyRoadmaps).map(([name, id]) => (
            <Link
              key={id}
              href={`/roadmap/${id}`}
              type="button"
              className="flex bg-white items-center gap-1.5 rounded-full border px-2 py-0.5 text-sm transition-colors hover:border-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {name}
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </div>
        <UserAvatars />
      </div>
      <div className="flex flex-col items-center gap-4 mb-6">
        <p className="flex items-center text-sm">
          <button className="rounded-xl border border-current px-2 py-0.5 text-sm text-gray-500 transition-colors hover:bg-gray-400 hover:text-white">
            Override all restrictions by{" "}
            <span className="font-semibold">inserting your own API key</span>
          </button>
        </p>
      </div>

      <div className="overflow-hidden max-w-screen-xl mx-auto h-64">
        <div className="overflow-x-hidden">
          <MarqueeDemo />
        </div>
      </div>

      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "-z-10"
        )}
      />
    </div>
  );
}
