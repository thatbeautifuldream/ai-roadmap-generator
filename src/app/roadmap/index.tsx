"use client";

import ExpandCollapse from "@/app/flow-components/expand-collapse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { LoaderCircle, Wand } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PresetActions } from "./components/preset-actions";
import { PresetShare } from "./components/preset-share";
import { tempData } from "@/app/shared/temp-data";

export default function Roadmap() {
  const [query, setQuery] = useState("");
  const { data, mutate, isPending, isError, isSuccess } = useMutation<
    any,
    AxiosError,
    { query: string }
  >({
    mutationFn: (variables) =>
      axios.post("/api/v1/cohere/roadmap/", { query: variables.query }),
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

  return (
    <>
      <div className="h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <Link
            className="hidden sm:inline text-lg font-semibold mr-4"
            href="/"
          >
            RoadmapAI
          </Link>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <Input
              type="text"
              placeholder="e.g. Try searching for Frontend or Backend"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={onSubmit} disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <LoaderCircle size={20} className="animate-spin" />
                  <span className="ml-2 hidden sm:inline">Generating</span>
                </>
              ) : (
                <>
                  <Wand size={20} />
                  <span className="ml-2 hidden sm:inline">Generate</span>
                </>
              )}
            </Button>
            <div className="hidden space-x-2 md:flex">
              <PresetShare />
            </div>
            <PresetActions />
          </div>
        </div>
        <Separator />
      </div>
      {/* <ExpandCollapse key={tempData[0].name} data={tempData} /> */}
      {isSuccess && (
        <ExpandCollapse key={data.data.tree[0].name} data={data.data.tree} />
      )}
    </>
  );
}
