import { SVGSkeleton, Skeleton } from "@/components/ui/skeleton";

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
            <SVGSkeleton className="inline-block w-[15px] h-[15px]" />
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
            <SVGSkeleton className="inline-block w-[15px] h-[15px]" />
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
            <SVGSkeleton className="inline-block w-[15px] h-[15px]" />
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

export default loading;
