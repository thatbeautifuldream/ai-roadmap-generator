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
import ModelSelect from "../flow-components/model-select";
import { useShallow } from "zustand/react/shallow";
import { useUIStore } from "../stores/useUI";
import { flushSync } from "react-dom";
import { useSearchParams } from "next/navigation";

import { toPng } from "html-to-image";
import {
  Panel,
  getRectOfNodes,
  getTransformForBounds,
  useReactFlow,
} from "reactflow";
import {
  DIAGRAM_IMAGE_WIDTH,
  decodeFromURL,
  DIAGRAM_IMAGE_HEIGHT,
  downloadImage,
} from "@/lib/utils";

export default function Roadmap() {
  const [query, setQuery] = useState("");
  const [mainQuery, setMainQuery] = useState("");
  const { model } = useUIStore(
    useShallow((state) => ({
      model: state.model,
    }))
  );
  const { data, mutate, isPending, isError, isSuccess } = useMutation<
    any,
    AxiosError,
    { query: string }
  >({
    mutationFn: (variables) =>
      axios.post(`/api/v1/${model}/roadmap/`, { query: variables.query }),
    mutationKey: ["Roadmap", mainQuery],
  });

  const onSubmit = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    try {
      flushSync(() => {
        setMainQuery(query);
      });
      mutate({ query });
    } catch (e) {
      console.log(e);
    }
  };
  const params = useSearchParams();

  const { getNodes } = useReactFlow();

  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(getNodes());
    const [x, y, scale] = getTransformForBounds(
      nodesBounds,
      DIAGRAM_IMAGE_WIDTH,
      DIAGRAM_IMAGE_HEIGHT,
      2,
      2
    );

    toPng(document.querySelector(".react-flow__viewport") as HTMLElement, {
      backgroundColor: "#ffffff",
      width: DIAGRAM_IMAGE_WIDTH,
      height: DIAGRAM_IMAGE_HEIGHT,
      style: {
        width: String(DIAGRAM_IMAGE_WIDTH) + "px",
        height: String(DIAGRAM_IMAGE_HEIGHT) + "px",
        transform: `translate(${x}px, ${y}px) scale(3)`,
      },
    }).then(downloadImage);
  };

  const renderFlow =
    data?.data?.tree?.[0]?.name || decodeFromURL(params)?.[0]?.name;

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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSubmit(e);
                }
              }}
            />
            <div className="hidden sm:flex">
              <ModelSelect />
            </div>
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
              {renderFlow && <PresetShare query={mainQuery} key={renderFlow} />}
              <Panel position="top-right">
                <button className="download-btn" onClick={onClick}>
                  Download Image
                </button>
              </Panel>
            </div>
            <PresetActions />
          </div>
        </div>
        <Separator />
      </div>
      {/* <ExpandCollapse key={tempData[0].name} data={tempData} /> */}
      {/* {isSuccess && ( */}
      {renderFlow && (
        <ExpandCollapse
          key={renderFlow}
          data={data?.data?.tree || decodeFromURL(params)}
        />
      )}
      {/* )} */}
    </>
  );
}
