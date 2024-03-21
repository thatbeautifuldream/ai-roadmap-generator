import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* <Hero /> */}
      <RoadmapLanding />
    </>
  );
}

function Hero() {
  return (
    <section className="text-center mt-16 md:mt-18 items-center flex flex-col">
      <Link href="/roadmap">
        <Button
          variant="outline"
          className="rounded-full border-border flex space-x-2 items-center"
        >
          <span>Announcing AI Roadmap</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={12}
            height={12}
            fill="none"
          >
            <path
              fill="currentColor"
              d="M8.783 6.667H.667V5.333h8.116L5.05 1.6 6 .667 11.333 6 6 11.333l-.95-.933 3.733-3.733Z"
            />
          </svg>
        </Button>
      </Link>
      <h1 className="text-6xl font-medium mt-6">Tailored Career Roadmaps</h1>
      <p className="mt-4 md:mt-6 text-[#707070] max-w-[600px]">
        {`Discover tailored learning paths to advance your career. Our roadmap
        generator guides you towards success, whether you're a beginner or an
        expert.`}
      </p>
      <div className="mt-8">
        <div className="flex items-center space-x-4">
          <Link href="/roadmap">
            <Button
              variant="outline"
              className="border border-primary h-12 px-6"
            >
              Start Your Journey
            </Button>
          </Link>
          <Link href="/explore">
            <Button className="h-12 px-5">Explore Roadmaps</Button>
          </Link>
        </div>
      </div>
      <p className="text-xs text-[#707070] mt-6">No credit card required.</p>
    </section>
  );
}

function RoadmapLanding() {
  return (
    <>
      <div className="flex flex-grow flex-col items-center px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-0 text-center sm:gap-2 md:mt-24 lg:mt-32">
          <h1 className="relative text-2xl font-medium sm:text-3xl">
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
        <div className="my-3 flex w-full max-w-[600px] flex-col items-center gap-3 sm:my-5">
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
              <span className="flex items-center text-base">
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
                  className="lucide lucide-ban mr-2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m4.9 4.9 14.2 14.2"></path>
                </svg>
                Generate
              </span>
            </button>
          </form>
          <div className="flex flex-row flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-sm transition-colors hover:border-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              OAuth
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-up-right "
              >
                <path d="M7 7h10v10"></path>
                <path d="M7 17 17 7"></path>
              </svg>
            </button>
            {/* Other buttons */}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-center text-gray-500">
            You have generated{" "}
            <span className="inline-block min-w-[50px] rounded-xl border px-1.5 text-center text-sm tabular-nums text-gray-800">
              4 of 4
            </span>{" "}
            roadmaps today.
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
      </div>
    </>
  );
}
