"use client";
import { getPublicRoadmaps } from "@/actions/roadmaps";
import { timeFromNow } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EmptyAlert } from "../alerts/EmptyAlert";
import { SearchAlert } from "../alerts/SearchAlert";
import { Input } from "../ui/input";
import RoadmapCard from "./roadmap-card";

const formSchema = z.object({
  query: z.string().min(1, { message: "Please enter a query to search" }),
});

const Search = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  const { data: roadmaps, isLoading } = useQuery({
    queryKey: ["public-roadmaps"],
    queryFn: async () => {
      const roadmaps = await getPublicRoadmaps();
      return roadmaps;
    },
  });

  const [filteredRoadmaps, setFilteredRoadmaps] = useState<typeof roadmaps>([]);

  useEffect(() => {
    if (roadmaps) {
      setFilteredRoadmaps(roadmaps);
    }
  }, [roadmaps]);

  if (roadmaps?.length === 0 && filteredRoadmaps?.length === 0) {
    return (
      <EmptyAlert description="There are no roadmaps that are public yet. Please come back again later or create a new public roadmap." />
    );
  }

  return (
    <div>
      <div className="flex gap-4 items-center justify-between">
        <Input
          className="input"
          type="text"
          placeholder="Start typing to search..."
          value={form.getValues().query}
          onChange={(e) => {
            form.setValue("query", e.target.value);
            setFilteredRoadmaps(
              roadmaps?.filter((roadmap) =>
                roadmap.title
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase()),
              ),
            );
          }}
        />
      </div>{" "}
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center mt-8">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : filteredRoadmaps && filteredRoadmaps?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 mb-10">
          {filteredRoadmaps?.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              author={roadmap.author.name}
              title={roadmap.title}
              views={roadmap.views.toString()}
              timeAgo={timeFromNow(roadmap?.createdAt?.toString())}
              slug={roadmap.id}
              savedRoadmapId={roadmap.id}
              imageUrl={roadmap.author.imageUrl!}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <SearchAlert />
        </div>
      )}
    </div>
  );
};

export default Search;
