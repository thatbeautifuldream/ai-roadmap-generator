"use client";
import Roadmap from "@/components/roadmap/roadmap";
import { Suspense } from "react";
import { ReactFlowProvider } from "reactflow";

export default function Home() {
  return (
    <Suspense fallback={<></>}>
      <ReactFlowProvider>
        <Roadmap />
      </ReactFlowProvider>
    </Suspense>
  );
}
