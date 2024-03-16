"use client";
import React, { use, useState } from "react";
import ExpandCollapse from "./ExpandCollapse";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LoaderCircle, Wand } from "lucide-react";

type Props = {};

const Roadmap = (props: Props) => {
  const [query, setQuery] = useState("");
  const { data, mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: (query) => axios.post("/api/v1/cohere/roadmap/", { query }),
  });

  const onSubmit = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      //@ts-expect-error - query is not a function but a string
      mutate(query);
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
          {/* <div className="mb-3 w-full rounded-xl bg-green-100 px-4 py-3 text-green-800">
            <h2 className="flex items-center text-base font-semibold text-green-800 sm:text-lg">
              AI Generated Roadmap{" "}
              <span className="ml-1.5 rounded-md border border-green-500 bg-green-200 px-1.5 text-xs uppercase tracking-wide text-green-800">
                Beta
              </span>
            </h2>
            <p className="mb-2 mt-1">
              This is an AI generated roadmap and is not verified by us.
            </p>
          </div> */}
          <form className="my-3 flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-center">
            <input
              type="text"
              placeholder="e.g. Try searching for Frontend or Backend"
              className="flex-grow rounded-md border border-gray-400 px-3 py-2 transition-colors focus:border-black focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="flex min-w-[127px] flex-shrink-0 items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <div className="animate-spin">
                    <LoaderCircle />
                  </div>
                  Generating
                </>
              ) : (
                <>
                  <Wand />
                  Generate
                </>
              )}
            </button>
          </form>
          {/* {isSuccess && <pre>{JSON.stringify(data, null, 2)}</pre>} */}
          {/* {isSuccess && <pre>{JSON.stringify(data.data.tree)}</pre>} */}
        </div>
      </div>
      {/* <ExpandCollapse key={tempData[0].name} data={tempData} /> */}
      {isSuccess && (
        <ExpandCollapse key={data.data.tree[0].name} data={data.data.tree} />
      )}
    </>
  );
};

export default Roadmap;
