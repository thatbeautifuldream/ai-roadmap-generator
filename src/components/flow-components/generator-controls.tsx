"use client";
import {
  changeRoadmapVisibility,
  checkIfTitleInUsersRoadmaps,
  deleteRoadmapById,
  isRoadmapGeneratedByUser,
  saveToUserDashboard,
} from "@/actions/roadmaps";
import { userHasCredits } from "@/actions/users";
import ApiKeyDialog from "@/components/ApiKeyDialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Visibility } from "@prisma/client";
import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Save, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { PresetShare } from "../../app/roadmap/components/preset-share";
import { useUIStore } from "@/lib/stores";
import GenerateButton from "./generate-button";
import ModelSelect from "./model-select";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface Props {
  title?: string;
  roadmapId: string;
  isPending: boolean;
  renderFlow: string;
  dbRoadmapId: string;
  visibility?: Visibility;
  mutate: UseMutateFunction<any, AxiosError<unknown, any>, any, unknown>;
}

export const GeneratorControls = (props: Props) => {
  const {
    title,
    mutate,
    roadmapId,
    isPending,
    renderFlow,
    dbRoadmapId,
    visibility: initialVisibility,
  } = props;
  const [visibility, setVisibility] = useState(initialVisibility);
  const [isGenerating, setIsGenerating] = useState(false);
  const [canSaveToDashboard, setCanSaveToDashboard] = useState(false);
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
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
    // Set model API key from local storage
    const modelApiKey = localStorage.getItem(`${model.toUpperCase()}_API_KEY`);
    setModelApiKey(modelApiKey);

    const checkRoadmapStatus = async () => {
      if (dbRoadmapId) {
        const { isGeneratedByUser, isSavedByUser, isAuthor } =
          await isRoadmapGeneratedByUser(dbRoadmapId);
        setCanSaveToDashboard(!isGeneratedByUser && !isSavedByUser);
        setShowVisibilityDropdown(isGeneratedByUser);
        setIsAuthor(isAuthor);
      }
    };
    checkRoadmapStatus();

    // Redirect if roadmapId changes
    if (roadmapId) {
      router.push(`/roadmap/${roadmapId}`);
    }
  }, [model, dbRoadmapId, roadmapId, setModelApiKey]);

  const onSubmit = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      if (!query) {
        return toast.error("Please enter a query", {
          description: "We need a query to generate a roadmap.",
          duration: 4000,
        });
      }

      const userCredits = await userHasCredits();
      if (!userCredits && modelApiKey === "") {
        return toast.error("You don't have enough credits", {
          description: "To continue please enter your own api key.",
          duration: 4000,
        });
      }
      const titleExists = await checkIfTitleInUsersRoadmaps(title as string);

      if (titleExists.state) {
        return toast.info("Roadmap already exists", {
          description: "The keyword you entered already exists.",
          duration: 4000,
          position: "top-center",
          action: {
            label: "View",
            onClick: () => {
              router.push(`/roadmap/${titleExists.id}`);
            },
          },
        });
      }

      toast.info("Generating roadmap", {
        description: "We are generating a roadmap for you.",
        duration: 4000,
      });

      mutate(
        {
          body: { query },
        },
        {
          onSuccess: () => {
            toast.success("Success", {
              description: "Roadmap generated successfully.",
              duration: 4000,
            });
          },
          onError: (error: any) => {
            toast.error("Something went wrong", {
              description:
                error.response?.data?.message || "Unknown error occurred",
              duration: 4000,
            });
          },
        },
      );
    } catch (e: any) {
      console.error("api error", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const onValueChange = async (value: Visibility) => {
    await changeRoadmapVisibility(dbRoadmapId, value);
    setVisibility(value); // Update visibility state
  };

  // Utility function to format visibility
  const formatVisibility = (visibility?: Visibility) => {
    switch (visibility) {
      case Visibility.PUBLIC:
        return "Public";
      case Visibility.PRIVATE:
        return "Private";
      default:
        return "Loading";
    }
  };

  const handleDelete = async () => {
    if (isAuthor) {
      const response = await deleteRoadmapById(dbRoadmapId);

      if (response.status === "success") {
        toast.success("Deleted", {
          description: "Roadmap deleted successfully ",
          duration: 4000,
        });
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Error", {
          description: response.message,
          duration: 4000,
        });
      }
    } else {
      toast.error("Unauthorized", {
        description: "You are not authorized to delete this roadmap.",
        duration: 4000,
      });
    }
  };

  const handleSaveToDashboard = async () => {
    if (canSaveToDashboard) {
      const response = await saveToUserDashboard(dbRoadmapId);
      if (response?.status === "success") {
        toast.success("Saved", {
          description: "Roadmap has been saved to your dashboard",
          duration: 4000,
        });
        setCanSaveToDashboard(false);
      } else {
        toast.error("Error", {
          description: response?.message,
          duration: 4000,
        });
      }
    }
  };

  const disableUI = isGenerating || isPending;

  return (
    <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
      <div className="md:mx-14 flex w-full space-x-2 sm:justify-end">
        {!dbRoadmapId && (
          <Input
            type="text"
            disabled={disableUI}
            placeholder="e.g. Try searching for Frontend or Backend"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSubmit(e);
              }
            }}
          />
        )}

        {dbRoadmapId && (
          <div className="flex-1 -ml-6 md:ml-0">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        )}

        {isAuthor && (
          <Button
            variant="outline"
            size="icon"
            className="mx-2 cursor-pointer"
            onClick={handleDelete}
          >
            <Trash className="cursor-pointer" size="16px" />
          </Button>
        )}

        {!showVisibilityDropdown && dbRoadmapId && canSaveToDashboard && (
          <Button onClick={handleSaveToDashboard} size="icon" variant="outline">
            <TooltipProvider>
              <Tooltip delayDuration={400}>
                <TooltipTrigger>
                  <Save size="16px" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save to Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        )}

        {showVisibilityDropdown && (
          <Select onValueChange={onValueChange} value={visibility}>
            <SelectTrigger className="md:w-[140px] w-fit">
              <SelectValue placeholder={formatVisibility(initialVisibility)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Visibility.PUBLIC}>Public</SelectItem>
              <SelectItem value={Visibility.PRIVATE}>Private</SelectItem>
            </SelectContent>
          </Select>
        )}

        {!dbRoadmapId && (
          <div className="">
            <ModelSelect disabled={disableUI} />
          </div>
        )}

        {!dbRoadmapId && (
          <GenerateButton onClick={onSubmit} disabled={disableUI} />
        )}

        {!dbRoadmapId && <ApiKeyDialog disabled={disableUI} />}

        {renderFlow && dbRoadmapId && (
          <div className="flex space-x-2">
            <PresetShare key={renderFlow} />
          </div>
        )}
      </div>
    </div>
  );
};
