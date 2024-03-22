"use client";

import { getRoadmapById } from "@/actions/roadmaps";
import ExpandCollapse from "@/app/flow-components/expand-collapse";
import { Separator } from "@/components/ui/separator";
import { useGenerateRoadmap } from "@/lib/queries";
import { decodeFromURL } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { GeneratorControls } from "../flow-components/generator-controls";
import { useUIStore } from "../stores/useUI";
import { EmptyAlert } from "@/components/alerts/EmptyAlert";

interface Props {
  roadmapId?: string;
}

export default function Roadmap({ roadmapId }: Props) {
  const { model, mainQuery, modelApiKey } = useUIStore(
    useShallow((state) => ({
      model: state.model,
      query: state.query,
      mainQuery: state.mainQuery,
      setMainQuery: state.setMainQuery,
      modelApiKey: state.modelApiKey,
      setModelApiKey: state.setModelApiKey,
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
  });

  const { data, mutate, isPending } = useGenerateRoadmap(
    mainQuery,
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
          // data={data}
          mutate={mutate}
          isPending={isPending}
          renderFlow={renderFlow}
        />
      </div>
      <Separator />
      {renderFlow ? (
        <ExpandCollapse
          key={renderFlow}
          data={roadmap?.content || data?.tree || decodeFromURL(params)}
        />
      ) : (
        <div className="mx-auto max-w-5xl mt-8">
          <EmptyAlert />
        </div>
      )}
    </>
  );
}
