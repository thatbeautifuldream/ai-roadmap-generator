import DotPattern from "@/components/magicui/dot-pattern";
import { buttonVariants } from "@/components/ui/button";
import MarqueeDemo from "@/components/ui/marque-wrapper";
import { CheckIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Book,
  GlobeLock,
  Network,
  Telescope,
  Wand,
} from "lucide-react";
import Link from "next/link";

function RoadmapHero() {
  const trendyRoadmaps = [
    "Backend",
    "Frontend",
    "Fullstack",
    "Machine Learning",
  ];

  return (
    <>
      <div className="flex flex-grow flex-col items-center px-4 py-6 sm:px-6 overflow-hidden">
        <div className="flex flex-col gap-0 text-center sm:gap-1 sm:mt-6 md:mt-8 lg:mt-12">
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
            {/* TODO : Add trendy topic from the database */}
            {trendyRoadmaps.map((trendyTopic) => (
              <button
                key={trendyTopic}
                type="button"
                className="flex bg-white items-center gap-1.5 rounded-full border px-2 py-0.5 text-sm transition-colors hover:border-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {trendyTopic}
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 mb-6">
          <p className="flex items-center text-sm">
            <button className="rounded-xl border border-current px-2 py-0.5 text-sm text-blue-500 transition-colors hover:bg-blue-400 hover:text-white">
              By-pass all limits by{" "}
              <span className="font-semibold">adding your own API key</span>
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
    </>
  );
}

const features = [
  {
    name: "Visualise Roadmap Tree.",
    description:
      "We have built a visualisation tool to help you understand the roadmap better.",
    icon: Network,
  },
  {
    name: "Book Recomendations.",
    description:
      "We help you with relivant books to read to understand the topic better. Powered by Oriley.",
    icon: Book,
  },
  {
    name: "Privacy Friendly.",
    description:
      "If you want to generate a roadmap without sharing it to the world, we got you covered.",
    icon: GlobeLock,
  },
];

function RoadmapFeatures() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-base font-semibold leading-7 text-gray-600">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            No structured learning plan? No problem.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We help you generate a structured learning roadmap for any topic you
            want to learn. Just enter the topic and let us handle the rest.
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <img
            src="./images/roadmapai-screenshot.png"
            alt="App screenshot"
            className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            width={2432}
            height={1442}
          />
          <div className="relative" aria-hidden="true">
            <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <feature.icon
                  className="absolute left-1 top-1 h-5 w-5 text-gray-600"
                  aria-hidden="true"
                />
                {feature.name}
              </dt>{" "}
              <dd className="inline">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

const includedFeatures = [
  "Private forum access",
  "Member resources",
  "Credit refresh every month",
  "Access to world class LLMs",
];

function RoadmapPricing() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple no-tricks pricing
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Get access to best of OpenAI, Gemini, Cohere and knowledge resources
            crafted for best learning experience for a fraction of the price.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              Annual membership
            </h3>
            <p className="mt-6 text-base leading-7 text-gray-600">
              We currently offer a single plan that includes access to all of
              our content. You can generate roadmaps for any topic you want to
              learn.
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-gray-600">
                What’s included
              </h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
            >
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className="h-6 w-5 flex-none text-gray-600"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">
                  Pay once, own it for a year
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-4xl font-bold tracking-tight text-gray-400 line-through">
                    $149
                  </span>
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    $49
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                    USD
                  </span>
                </p>
                <a
                  href="#"
                  className="mt-10 block w-full rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled"
                >
                  Currently unavailable
                </a>
                <p className="mt-6 text-xs leading-5 text-gray-600">
                  Invoices and receipts available for easy company reimbursement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <RoadmapHero />
      <RoadmapFeatures />
      <RoadmapPricing />
    </>
  );
}
