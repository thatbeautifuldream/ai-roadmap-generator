"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/lib/queries";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function RoadmapCard({
  title,
  views,
  timeAgo,
  id,
}: {
  title?: string;
  views?: string;
  timeAgo?: string;
  id?: string;
}) {
  return (
    <>
      <Link
        href={`/roadmap/${id}`}
        className="flex flex-col rounded-md border transition-colors hover:bg-gray-100"
        style={{ maxHeight: "150px", overflow: "hidden" }}
      >
        <h2 className="flex-grow px-2.5 py-2.5 text-base font-medium leading-tight">
          {title}
        </h2>
        <div className="flex items-center justify-between gap-2 px-2.5 py-2">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <EyeIcon />
            {views}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            {timeAgo}
          </span>
        </div>
      </Link>
    </>
  );
}

export const Search = () => {
  const [search, setSearch] = useState("");

  const {
    data: searchData,
    mutate: searchMutate,
    isPending: isSearchPending,
  } = useSearch(search);
  console.log({ searchData });

  return (
    <>
      <div className="flex flex-row">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button
          isLoading={isSearchPending}
          onClick={() => {
            searchMutate(
              { body: { query: search } },
              {
                onSuccess: (data) => {
                  console.log(data);
                },
              }
            );
          }}
        >
          Search
        </Button>
      </div>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchData &&
          searchData.data.map((item: any) => (
            <>
              <RoadmapCard
                key={item.id}
                title={item.title}
                views="2 views"
                timeAgo="2 days ago"
                id={item.id}
              />
            </>
          ))}
      </div>
    </>
  );
};
