"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DIAGRAM_IMAGE_HEIGHT,
  DIAGRAM_IMAGE_WIDTH,
  downloadImage,
} from "@/lib/utils";
import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toPng } from "html-to-image";
import Link from "next/link";
import { useEffect } from "react";
import { flushSync } from "react-dom";
import { getRectOfNodes, getTransformForBounds, useReactFlow } from "reactflow";
import { useShallow } from "zustand/react/shallow";
import GenerateButton from "../flow-components/generate-button";
import ModelSelect from "../flow-components/model-select";
import { PresetActions } from "../roadmap/components/preset-actions";
import { PresetShare } from "../roadmap/components/preset-share";
import { useUIStore } from "../stores/useUI";

interface Props {
  renderFlow: string;
  isPending: boolean;
  mutate: UseMutateFunction<any, AxiosError<unknown, any>, any, unknown>;
}

export const GeneratorControls = (props: Props) => {
  const { renderFlow, mutate, isPending } = props;
  const { getNodes } = useReactFlow();
  const { model, query, mainQuery, setMainQuery, setModelApiKey, setQuery } =
    useUIStore(
      useShallow((state) => ({
        model: state.model,
        query: state.query,
        mainQuery: state.mainQuery,
        setMainQuery: state.setMainQuery,
        setModelApiKey: state.setModelApiKey,
        setQuery: state.setQuery,
      }))
    );

  useEffect(() => {
    const modelApiKey = localStorage.getItem(`${model}_API_KEY`);
    if (modelApiKey) {
      setModelApiKey(modelApiKey);
    }
  });

  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(getNodes());
    const [x, y, scale] = getTransformForBounds(
      nodesBounds,
      DIAGRAM_IMAGE_WIDTH,
      DIAGRAM_IMAGE_HEIGHT,
      0.5,
      2
    );

    toPng(document.querySelector(".react-flow__viewport") as HTMLElement, {
      backgroundColor: "#ffffff",
      width: DIAGRAM_IMAGE_WIDTH,
      height: DIAGRAM_IMAGE_HEIGHT,
      style: {
        width: String(DIAGRAM_IMAGE_WIDTH),
        height: String(DIAGRAM_IMAGE_HEIGHT),
        transform: `translate(${x - 300}px, ${y}px) scale(1)`,
      },
    }).then(downloadImage);
  };

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

      mutate({ body: { query: mainQuery } });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <div className="relative">
          <Link
            className="hidden sm:inline text-lg font-semibold mr-4"
            href="/"
          >
            RoadmapAI
          </Link>
          <span className="hidden sm:inline top-[22px] absolute left-[72px] items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-700">
            BETA
          </span>
        </div>

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
          <GenerateButton onClick={onSubmit} disabled={isPending} />
          <div className="hidden space-x-2 md:flex">
            {renderFlow && (
              <>
                <PresetShare query={mainQuery} key={renderFlow} />
                <Button variant="secondary" onClick={onClick}>
                  Download
                </Button>
              </>
            )}
          </div>
          <PresetActions />
        </div>
      </div>
    </>
  );
};
