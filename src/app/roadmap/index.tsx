"use client";

import { getRoadmapById } from "@/actions/roadmaps";
import ExpandCollapse from "@/components/flow-components/expand-collapse";
import { Separator } from "@/components/ui/separator";
import { useGenerateRoadmap } from "@/lib/queries";
import { decodeFromURL } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { GeneratorControls } from "../../components/flow-components/generator-controls";
import { useUIStore } from "../../lib/stores/useUI";
import Instructions from "@/components/flow-components/Instructions";

interface Props {
  roadmapId?: string;
}

export default function Roadmap({ roadmapId }: Props) {
  const { model, modelApiKey, query } = useUIStore(
    useShallow((state) => ({
      model: state.model,
      query: state.query,
      modelApiKey: state.modelApiKey,
    })),
  );

  const { data: roadmap, isPending: isRoadmapPending } = useQuery({
    queryFn: async () => {
      let roadmap = await getRoadmapById(roadmapId || "");
      if (roadmap) {
        let json = JSON.parse(roadmap.content);
        roadmap.content = json;
        return roadmap;
      }
      throw Error("error");
    },
    queryKey: ["Roadmap", roadmapId],
    enabled: Boolean(roadmapId),
  });

  const { data, mutate, isPending } = useGenerateRoadmap(
    query,
    model,
    modelApiKey,
  );

  const params = useSearchParams();

  const renderFlow =
    roadmap?.content[0] ||
    data?.tree?.[0]?.name ||
    decodeFromURL(params)?.[0]?.name;

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <GeneratorControls
          mutate={mutate}
          isPending={isPending}
          renderFlow={renderFlow}
          roadmapId={data?.roadmapId}
          dbRoadmapId={roadmapId || ""}
          visibility={roadmap?.visibility}
          title={query}
          key={roadmap?.visibility}
        />
      </div>
      <Separator />
      {isPending ? (
        <div className="h-[75vh] grid place-content-center">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : isRoadmapPending && roadmapId ? (
        <div>
          <div className="h-[75vh] grid place-content-center">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        </div>
      ) : (
        <>
          {renderFlow ? (
            <ExpandCollapse
              key={renderFlow}
              data={roadmap?.content || data?.tree || decodeFromURL(params)}
              isPending={isRoadmapPending || isPending}
              roadmapId={roadmapId}
            />
          ) : (
            <Instructions />
          )}
        </>
      )}
    </>
  );
}
