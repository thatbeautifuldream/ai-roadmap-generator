"use client";
import { EmptyAlert } from "../alerts/EmptyAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/lib/queries";
import { timeFromNow } from "@/lib/utils";
import { useEffect, useState } from "react";
import RoadmapCard from "./roadmap-card";
import { Loader2 } from "lucide-react";
import { SearchAlert } from "../alerts/SearchAlert";

export const Search = () => {
  const [search, setSearch] = useState("");

  const {
    data: searchData,
    mutate: searchMutate,
    isPending: isSearchPending,
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
        <Input placeholder="Search for a roadmap" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button onClick={onSearch}>Search</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 mb-10">
        {isSearchPending ? (
          <div className="w-[100vw] min-h-[86vh] flex justify-center">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : searchData?.data?.length > 0 ? (
          searchData.data.map((roadmap: any) => (
            <RoadmapCard
              key={roadmap.id}
              title={roadmap.title}
              views="2 views"
              timeAgo={timeFromNow(roadmap?.createdAt?.toString())}
              slug={roadmap.id}
            />
          ))
        ) : (
          <div className="w-full ml-48">
            <SearchAlert />
          </div>
        )}
      </div>
    </>
  );
};
