"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { LoaderCircle, Wand } from "lucide-react";
import React, { useState } from "react";
import ExpandCollapse from "./expand-collapse";

type Props = {};

const Roadmap = (props: Props) => {
  const [query, setQuery] = useState("");
  const { data, mutate, isPending, isError, isSuccess } = useMutation<
    any,
    AxiosError,
    { query: string }
  >({
    mutationFn: (variables) =>
      axios.post("/api/v1/openai/roadmap/", { query: variables.query }),
  });

  const onSubmit = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      mutate({ query });
    } catch (e) {
      console.log(e);
    }
  };

  const tempData = [
    {
      name: "Devops",
      children: [
        {
          name: "The Fundamentals",
          children: [
            { name: "Understanding DevOps" },
            { name: "DevOps Vs IT Operations" },
            { name: " DevOps Core Concepts" },
          ],
        },
        {
          name: "Implementing DevOps",
          children: [
            { name: "DevOps Toolchains" },
            { name: "Continuous Integration Tools" },
            { name: "Continuous Deployment & Delivery" },
            { name: "Deployment Strategies" },
          ],
        },
        {
          name: "Cultivating DevOps Culture",
          children: [
            { name: "DevOps Team Structure" },
            { name: "Embracing Agile Methods" },
            { name: "Sprints & Scrums" },
            { name: "Testing & Quality Assurance" },
          ],
        },
        {
          name: "DevOps Strategy & Planning",
          children: [
            { name: "Strategizing DevOps Initiatives" },
            { name: "OpsOps Assessment" },
            { name: "Planning for Change & Capacity Management" },
            { name: "Setting Service Level Objectives" },
          ],
        },
        {
          name: "DevOps Automation",
          children: [
            { name: "Automating Infrastructure Provisioning" },
            { name: "Config Management & Orchestration" },
            { name: "Automation Testing" },
            { name: "Continuous Monitoring" },
          ],
        },
      ],
    },
  ];

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <form className="my-3 flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-center">
            <Input
              type="text"
              placeholder="e.g. Try searching for Frontend or Backend"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" onClick={onSubmit} disabled={isPending}>
              {isPending ? (
                <>
                  <LoaderCircle size={20} className="animate-spin mr-2" />
                  Generating
                </>
              ) : (
                <>
                  <Wand size={20} className="mr-2" />
                  Generate
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
      <ExpandCollapse key={tempData[0].name} data={tempData} />
      {/* {isSuccess && (
        <ExpandCollapse key={data.data.tree[0].name} data={data.data.tree} />
      )} */}
    </>
  );
};

export default Roadmap;
