import { Card } from "@/components/ui/card";
import { Network } from "lucide-react";
import Link from "next/link";

function RoadmapEmptyState() {
  return (
    <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center ">
      <Network className="mx-auto h-12 w-12 text-gray-300" />
      <span className="mt-2 block text-sm font-semibold text-gray-900">
        Generate a new roadmap
      </span>
    </div>
  );
}

const AppInstructions = () => {
  return (
    <div className="mx-auto max-w-7xl w-full md:h-[75vh] flex flex-col items-center justify-center">
      <Card className="md:p-14 p-10">
        <h1 className="text-3xl font-bold my-4">
          Some Instructions before you proceed
        </h1>
        <ol className="list-disc flex flex-col gap-4">
          <li>
            Use Cohere from the dropdown to generate free roadmaps while you
            have credits.
          </li>
          <li>If an error occurs, please try again a few times.</li>
          <li>
            Look out for previously generated roadmaps in the{" "}
            <Link className="underline underline-offset-4" href="/explore">
              Explorer
            </Link>{" "}
            section.
          </li>
          <li>If you finish your credits, please add your own api key.</li>
          <li>
            Avoid searching for NSFW/sensitive content. The roadmap for it wont
            be generated.
          </li>
          <li>
            If you like this tool, please give it a star on{" "}
            <Link
              className="underline underline-offset-4"
              href="https://github.com/vishwajeetraj11/ai-roadmap-generator"
            >
              GitHub
            </Link>
            .
          </li>
        </ol>
      </Card>
    </div>
  );
};

const Instructions = () => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <RoadmapEmptyState />
      </div>
    </div>
  );
};

export default Instructions;
