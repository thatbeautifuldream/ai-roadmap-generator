"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/lib/queries";
import { timeFromNow } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SearchAlert } from "../alerts/SearchAlert";
import RoadmapCard from "./roadmap-card";

export const Search = () => {
  const [search, setSearch] = useState("");

  const {
    data: searchData,
    mutate: searchMutate,
    isPending: isSearchPending,
    isSuccess: isSearchSuccess,
    isError: isSearchError,
  } = useSearch(search);

  const onSearch = () => {
    searchMutate({ body: { query: search } });
  };

  useEffect(() => {
    onSearch();
  }, [search]);

  return (
    <>
      <div className="flex gap-8 flex-row">
        <Input
          placeholder="Search for a roadmap"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={onSearch}>Search</Button>
      </div>
      {isSearchPending && (
        <div className="flex justify-center mt-8">
          <Loader2 className="animate-spin" />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 mb-10">
        {isSearchSuccess &&
          searchData?.data?.length > 0 &&
          [...searchData.data]
            .reverse()
            .map((roadmap: any) => (
              <RoadmapCard
                key={roadmap.id}
                title={roadmap.title}
                views="2 views"
                timeAgo={timeFromNow(roadmap?.createdAt?.toString())}
                slug={roadmap.id}
              />
            ))}
        {isSearchError && (
          <div className="w-full ml-48">
            <SearchAlert />
          </div>
        )}
      </div>
    </>
  );
};
