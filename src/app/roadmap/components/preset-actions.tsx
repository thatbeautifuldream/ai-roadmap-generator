"use client";

import { Dialog } from "@radix-ui/react-dialog";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import * as React from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { modelKeys, availableModels } from "@/app/shared/constants";
import { UModel, useUIStore } from "@/app/stores/useUI";

export function PresetActions() {
  const [open, setIsOpen] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const { setModel, model } = useUIStore(
    useShallow((state) => ({
      setModel: state.setModel,
      model: state.model,
    }))
  );
  const onValueChange = (val: string) => setModel(val as UModel);

  useEffect(() => {
    const modelKey = localStorage.getItem("model");
    const exist = modelKeys.find((key) => key === modelKey);
    if (exist && modelKey) {
      setModel(modelKey as UModel);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("model", model);
  }, [model]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <span className="sr-only">Actions</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setIsOpen(true)}>
            Select Model
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Model</DialogTitle>
            <DialogDescription>
              The model you select will be used to generate the roadmap.
            </DialogDescription>
          </DialogHeader>
          <div>
            <h4 className="text-sm text-muted-foreground">
              Select the model you want to use
            </h4>
            <div className="flex items-start justify-between space-x-4 pt-3">
              <RadioGroup value={model} onValueChange={onValueChange}>
                {availableModels.map((model) => (
                  <div className="flex items-center space-x-2" key={model.key}>
                    <RadioGroupItem value={model.key} id={model.key} />
                    <Label htmlFor={model.key}>{model.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This preset will no longer be
              accessible by you or others you&apos;ve shared it with.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDeleteDialog(false);
                toast({
                  description: "This preset has been deleted.",
                });
              }}
            >
              Logout
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
