"use client";
import Roadmap from "@/app/roadmap";
import React from "react";
import { ReactFlowProvider } from "reactflow";

export default function Home() {
  return (
    <>
      <ReactFlowProvider>
        <Roadmap />
      </ReactFlowProvider>
    </>
  );
}
