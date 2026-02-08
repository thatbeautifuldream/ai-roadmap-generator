import Search from "@/components/flow-components/Search";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

function SearchFallback() {
  return (
    <div className="w-full h-full flex justify-center items-center mt-8">
      <Loader2 className="animate-spin w-8 h-8" />
    </div>
  );
}

export default function Explore() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-4">
          <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
            Explore Roadmaps
          </h2>
          <Suspense fallback={<SearchFallback />}>
            <Search />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
