import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = ({ width }: { width: string }) => (
  <a
    className="flex flex-col border transition-colors"
    style={{ maxWidth: "100%" }}
  >
    <h2 className="flex-grow px-2.5 py-2.5 leading-tight">
      <Skeleton className={`w-[${width}] max-w-full`} />
    </h2>
    <div className="flex items-center justify-between gap-2 px-2.5 py-2">
      <span className="flex items-center gap-1.5">
        <Skeleton className="w-[56px] max-w-full" />
      </span>
      <span className="flex items-center gap-1.5">
        <Skeleton className="w-[136px] max-w-full" />
      </span>
    </div>
  </a>
);

const Loading = () => {
  const items = [
    { id: 1, width: "320px" },
    { id: 2, width: "320px" },
    { id: 3, width: "320px" },
    { id: 4, width: "320px" },
    { id: 5, width: "320px" },
    { id: 6, width: "320px" },
  ];

  return (
    <div className="flex justify-center w-full h-full p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <LoadingSkeleton key={item.id} width={item.width} />
        ))}
      </div>
    </div>
  );
};

export default Loading;
