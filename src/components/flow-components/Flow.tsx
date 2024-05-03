"use client";
import Roadmap from "@/components/roadmap/roadmap";
import { Suspense } from "react";
import { ReactFlowProvider } from "reactflow";

export const Flow = ({ roadmapId }: { roadmapId: string }) => {
  return (
    <Suspense fallback={<></>}>
      <ReactFlowProvider>
        <Roadmap roadmapId={roadmapId} />
      </ReactFlowProvider>
    </Suspense>
  );
};
