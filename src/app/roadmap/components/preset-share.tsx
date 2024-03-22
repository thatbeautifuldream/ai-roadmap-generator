"use client";

import { CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQueryClient } from "@tanstack/react-query";
import LZString from "lz-string";
import { toast } from "sonner";

export function PresetShare({ query }: { query: string }) {
  const queryClient = useQueryClient();

  const getURL = () => {
    const mutationCache = queryClient.getMutationCache();
    const data = mutationCache.find({ mutationKey: ["Roadmap", query] }) as any;

    // TODO
    // if openai
    if (data?.state?.data?.data?.tree) {
      const string = JSON.stringify(data?.state?.data?.data?.tree || "{}");
      const compressed = LZString.compressToEncodedURIComponent(string);
      return compressed;
    } else return "";
    // cohere
    // gemini
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Share</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[520px]">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold">Share roadmap</h3>
          <p className="text-sm text-muted-foreground">
            Anyone who has this link can view your roadmap.
          </p>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={
                typeof window !== "undefined" && window.location.origin
                  ? window.location.origin + "?code=" + getURL()
                  : "" + "?code=" + getURL()
              }
              readOnly
              className="h-9"
            />
          </div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                (document.getElementById("link") as HTMLInputElement)?.value
              );
              toast.success("Link copied to clipboard");
            }}
            type="button"
            size="sm"
            className="px-3"
          >
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
