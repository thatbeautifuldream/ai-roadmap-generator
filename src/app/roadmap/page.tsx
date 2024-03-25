"use client";
import Roadmap from "@/app/roadmap";
import { Icons } from "@/app/shared/Icons";
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
