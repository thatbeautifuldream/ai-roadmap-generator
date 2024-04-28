"use client";

import { CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

export function PresetShare() {
  const pathName = usePathname();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="md:w-[520px] w-[380px]">
        <DialogHeader>
          <DialogTitle>Share roadmap</DialogTitle>
          <DialogDescription>
            Anyone who has this link can view your roadmap.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={
                typeof window !== "undefined"
                  ? window.location.origin + pathName
                  : ""
              }
              readOnly
              className="h-9 cursor-default"
            />
          </div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                (document.getElementById("link") as HTMLInputElement)?.value
              );
              toast.success("Copied", {
                description: "Link copied to clipboard successfully.",
                duration: 4000,
              });
            }}
            type="button"
            size="sm"
            className="px-3"
          >
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
        <QRCodeSVG
          className="w-full"
          size={300}
          value={(document.getElementById("link") as HTMLInputElement)?.value}
        />
      </DialogContent>
    </Dialog>
  );
}
