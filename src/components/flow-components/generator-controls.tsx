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
import { useEffect } from "react";
import { getRectOfNodes, getTransformForBounds, useReactFlow } from "reactflow";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { PresetActions } from "../../app/roadmap/components/preset-actions";
import { PresetShare } from "../../app/roadmap/components/preset-share";
import { useUIStore } from "../../app/stores/useUI";
import GenerateButton from "./generate-button";
import ModelSelect from "./model-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Visibility } from "@prisma/client";
import ApiKeyDialog from "@/components/ApiKeyDialog";
import { decrementCreditsByUserId } from "@/actions/users";

interface Props {
  renderFlow: string;
  isPending: boolean;
  mutate: UseMutateFunction<any, AxiosError<unknown, any>, any, unknown>;
}

export const GeneratorControls = (props: Props) => {
  const { renderFlow, mutate, isPending } = props;
  const { getNodes } = useReactFlow();
  const { model, query, setModelApiKey, setQuery, modelApiKey } = useUIStore(
    useShallow((state) => ({
      model: state.model,
      query: state.query,
      setModelApiKey: state.setModelApiKey,
      setQuery: state.setQuery,
    })),
  );

  useEffect(() => {
    const modelApiKey = localStorage.getItem(`${model.toUpperCase()}_API_KEY`);
    if (modelApiKey) {
      setModelApiKey(modelApiKey);
    }
  }, [model, setModelApiKey]);

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
      2,
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
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    try {
      if (!query) {
        return toast.error("Please enter a query", {
          description: "We need a query to generate a roadmap.",
          position: "bottom-right",
          duration: 4000,
        });
      }

      const userCredits = await decrementCreditsByUserId()
      if(!userCredits && modelApiKey === "") {
        return toast.error("You don't have enough credits", {
          description: "To continue please enter your own api key.",
          position: "bottom-right",
          duration: 4000,
        })
      }

      toast.info("We are generating your roadmap. Please wait...", {
        position: "bottom-right",
        duration: 4000,
      });

      // [TODO] : Check if title query is present in db if yes return data from db
      mutate({ body: { query } });
    } catch (e: any) {
      if (e.response?.message) {
        toast.error(e.response.message, {
          position: "bottom-right",
          duration: 4000,
        });
      }
      console.error("api error",e);
    }
  };

  const onValueChange = (value: string) => {
    console.log(value);
  };

  return (
    <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
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
        {/* TODO Add logic to set visibility in backend */}
        <Select onValueChange={onValueChange}>
          <SelectTrigger className="md:w-[140px] w-fit">
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Visibility.PUBLIC}>Public</SelectItem>
            <SelectItem value={Visibility.PRIVATE}>Private</SelectItem>
          </SelectContent>
        </Select>
        <GenerateButton onClick={onSubmit} disabled={isPending} />
        <ApiKeyDialog />
        {renderFlow && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <PresetShare query={query} key={renderFlow} />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button variant="secondary" onClick={onClick}>
                    Download
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
      <div className="flex space-x-2 sm:hidden">
        <PresetActions />
      </div>
    </div>
  );
};
