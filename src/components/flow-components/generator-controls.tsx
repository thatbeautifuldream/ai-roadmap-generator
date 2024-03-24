"use client";
import {
  changeRoadmapVisibility,
  isRoadmapGeneratedByUser,
} from "@/actions/roadmaps";
import { userHasCredits } from "@/actions/users";
import ApiKeyDialog from "@/components/ApiKeyDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DIAGRAM_IMAGE_HEIGHT,
  DIAGRAM_IMAGE_WIDTH,
  downloadImage,
} from "@/lib/utils";
import { Visibility } from "@prisma/client";
import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toPng } from "html-to-image";
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRectOfNodes, getTransformForBounds, useReactFlow } from "reactflow";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { PresetActions } from "../../app/roadmap/components/preset-actions";
import { PresetShare } from "../../app/roadmap/components/preset-share";
import { useUIStore } from "../../app/stores/useUI";
import GenerateButton from "./generate-button";
import ModelSelect from "./model-select";

interface Props {
  renderFlow: string;
  isPending: boolean;
  mutate: UseMutateFunction<any, AxiosError<unknown, any>, any, unknown>;
  roadmapId: string;
  dbRoadmapId: string;
  visibility: Visibility;
}

export const GeneratorControls = (props: Props) => {
  const { renderFlow, mutate, isPending, roadmapId, dbRoadmapId, visibility: initialVisibility } = props;
  const [visibility, setVisibility] = useState<Visibility>(initialVisibility); // Manage visibility state
  const { getNodes } = useReactFlow();
  const router = useRouter();

  const { model, query, setModelApiKey, setQuery, modelApiKey } = useUIStore(
    useShallow((state) => ({
      model: state.model,
      query: state.query,
      modelApiKey: state.modelApiKey,
      setModelApiKey: state.setModelApiKey,
      setQuery: state.setQuery,
    })),
  );

  useEffect(() => {
    const modelApiKey = localStorage.getItem(`${model.toUpperCase()}_API_KEY`);
    setModelApiKey(modelApiKey);
  }, [model]);

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

      const userCredits = await userHasCredits();
      if (!userCredits && modelApiKey === "") {
        return toast.error("You don't have enough credits", {
          description: "To continue please enter your own api key.",
          position: "bottom-right",
          duration: 4000,
        });
      }

      toast.info("Generating roadmap", {
        description: "We are generating a roadmap for you.",
        position: "bottom-right",
        duration: 4000,
      });

      // [TODO] : Check if title query is present in db if yes return data from db
      mutate(
        {
          body: { query },
        },
        {
          onSuccess: () => {
            toast.success("Success", {
              description: "Roadmap generated successfully.",
              position: "bottom-right",
              duration: 4000,
            });
          },
          onError: (error: any) => {
            console.log("Trying to catch error", error);
            toast.error("Something went wrong", {
              description:
                error.response?.data?.message || "Unknown error occurred",
              position: "bottom-right",
              duration: 4000,
            });
          },
        },
      );
    } catch (e: any) {
      console.error("api error", e);
    }
  };

  const onValueChange = async (value: Visibility) => {
    await changeRoadmapVisibility(dbRoadmapId, value);
    setVisibility(value); // Update visibility state
  };

  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (dbRoadmapId !== undefined) {
        const visibility = await isRoadmapGeneratedByUser(dbRoadmapId);
        setShowVisibilityDropdown(visibility);
      }
    };

    fetchData();
  }, [roadmapId]);

  useEffect(() => {
    if (roadmapId) {
      router.push(`/roadmap/${roadmapId}`);
    }
  }, [roadmapId]);
  console.log(dbRoadmapId, showVisibilityDropdown);

  // Utility function to format visibility
  const formatVisibility = (visibility: Visibility) => {
    switch (visibility) {
      case Visibility.PUBLIC:
        return "Public";
      case Visibility.PRIVATE:
        return "Private";
      default:
        return "Unknown";
    }
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
        {showVisibilityDropdown && (
          <Select onValueChange={onValueChange} value={visibility}>
            <SelectTrigger className="md:w-[140px] w-fit">
              <SelectValue placeholder={formatVisibility(initialVisibility)} /> {/* Use the formatted value */}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Visibility.PUBLIC}>Public</SelectItem>
              <SelectItem value={Visibility.PRIVATE}>Private</SelectItem>
            </SelectContent>
          </Select>
        )}

        <div className="hidden sm:flex">
          <ModelSelect />
        </div>
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
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={onClick}
                  >
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
