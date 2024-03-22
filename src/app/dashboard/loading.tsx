import { SVGSkeleton, Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";

const LoadingSkeleton = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <a className="flex flex-col border transition-colors">
        <h2 className="flex-grow px-2.5 py-2.5 leading-tight">
          <Skeleton className="w-[72px] max-w-full" />
        </h2>
        <div className="flex items-center justify-between gap-2 px-2.5 py-2">
          <span className="flex items-center gap-1.5">
            <Skeleton className="w-[56px] max-w-full" />
            <SVGSkeleton className="inline-block w-[10px] h-[15px]" />
          </span>
          <span className="flex items-center gap-1.5">
            <Skeleton className="w-[136px] max-w-full" />
          </span>
        </div>
      </a>
      <a className="flex flex-col border transition-colors">
        <h2 className="flex-grow px-2.5 py-2.5 leading-tight">
          <Skeleton className="w-[144px] max-w-full" />
        </h2>
        <div className="flex items-center justify-between gap-2 px-2.5 py-2">
          <span className="flex items-center gap-1.5">
            <Skeleton className="w-[56px] max-w-full" />
            <SVGSkeleton className="inline-block w-[10px] h-[15px]" />
          </span>
          <span className="flex items-center gap-1.5">
            <Skeleton className="w-[136px] max-w-full" />
          </span>
        </div>
      </a>
      <a className="flex flex-col border transition-colors">
        <h2 className="flex-grow px-2.5 py-2.5 leading-tight">
          <Skeleton className="w-[104px] max-w-full" />
        </h2>
        <div className="flex items-center justify-between gap-2 px-2.5 py-2">
          <span className="flex items-center gap-1.5">
            <Skeleton className="w-[56px] max-w-full" />
            <SVGSkeleton className="inline-block w-[10px] h-[15px]" />
          </span>
          <span className="flex items-center gap-1.5">
            <Skeleton className="w-[136px] max-w-full" />
          </span>
        </div>
      </a>
      <a className="flex flex-col border transition-colors">
        <h2 className="flex-grow px-2.5 py-2.5 leading-tight">
          <Skeleton className="w-[64px] max-w-full" />
        </h2>
        <div className="flex items-center justify-between gap-2 px-2.5 py-2">
          <span className="flex items-center gap-1.5">
            <Skeleton className="w-[56px] max-w-full" />
            <SVGSkeleton className="inline-block w-[15px] h-[15px]" />
          </span>
          <span className="flex items-center gap-1.5">
            <Skeleton className="w-[136px] max-w-full" />
          </span>
        </div>
      </a>
      <a className="flex flex-col border transition-colors">
        <h2 className="flex-grow px-2.5 py-2.5 leading-tight">
          <Skeleton className="w-[56px] max-w-full" />
        </h2>
        <div className="flex items-center justify-between gap-2 px-2.5 py-2">
          <span className="flex items-center gap-1.5">
            <Skeleton className="w-[56px] max-w-full" />
            <SVGSkeleton className="inline-block w-[15px] h-[15px]" />
          </span>
          <span className="flex items-center gap-1.5">
            <Skeleton className="w-[136px] max-w-full" />
          </span>
        </div>
      </a>
      <a className="flex flex-col border transition-colors">
        <h2 className="flex-grow px-2.5 py-2.5 leading-tight">
          <Skeleton className="w-[56px] max-w-full" />
        </h2>
        <div className="flex items-center justify-between gap-2 px-2.5 py-2">
          <span className="flex items-center gap-1.5">
            <Skeleton className="w-[56px] max-w-full" />
            <SVGSkeleton className="inline-block w-[15px] h-[15px]" />
          </span>
          <span className="flex items-center gap-1.5">
            <Skeleton className="w-[136px] max-w-full" />
          </span>
        </div>
      </a>
    </div>
  </>
);

const loading = () => (
  <div className="flex justify-center w-full h-full p-10">
    <LoadingSkeleton />
  </div>
);


const Loading = () => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <Loader className="animate-spin" size={32} strokeWidth={3} color="gray" />
    </div>
  );
};

export default loading;
