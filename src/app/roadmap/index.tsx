"use client";

import ExpandCollapse from "@/app/flow-components/expand-collapse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { LoaderCircle, Wand } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useShallow } from "zustand/react/shallow";
import ModelSelect from "../flow-components/model-select";
import { useUIStore } from "../stores/useUI";
import { PresetActions } from "./components/preset-actions";
import { PresetShare } from "./components/preset-share";

import { saveRoadmap } from "@/actions/saveRoadmap";
import {
  DIAGRAM_IMAGE_HEIGHT,
  DIAGRAM_IMAGE_WIDTH,
  decodeFromURL,
  downloadImage,
} from "@/lib/utils";
import { toPng } from "html-to-image";
import { getRectOfNodes, getTransformForBounds, useReactFlow } from "reactflow";
import { toast } from "sonner";
import { tempData } from "@/app/shared/temp-data";
import GenerateButton from "../flow-components/generate-button";

interface Props {
  roadmapId?: string;
}

export default function Roadmap({ roadmapId }: Props) {
  const [query, setQuery] = useState("");
  const [mainQuery, setMainQuery] = useState("");
  const [modelApiKey, setModelApiKey] = useState("");

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
      axios.post(`/api/v1/${model}/roadmap?apiKey=${modelApiKey}`, {
        query: variables.query,
      }),
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

  const renderFlow =
    data?.data?.tree?.[0]?.name || decodeFromURL(params)?.[0]?.name;

  useEffect(() => {
    const modelApiKey = localStorage.getItem(`${model}_API_KEY`);
    if (modelApiKey) {
      setModelApiKey(modelApiKey);
    }
  });

  const handleSave = async () => {
    const response = await saveRoadmap(mainQuery, data?.data?.tree);
    console.log(response?.status);
    if (response?.status === "success") {
      toast.success("Roadmap saved successfully");
    }
  };

  return (
    <>
      <div className="h-full flex-col md:flex">
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
        <Separator />
      </div>
      {renderFlow ? (
        <ExpandCollapse
          key={renderFlow}
          data={data?.data?.tree || decodeFromURL(params)}
        />
      ) : (
        <ExpandCollapse key={tempData[0].name} data={tempData} />
      )}
    </>
  );
}
