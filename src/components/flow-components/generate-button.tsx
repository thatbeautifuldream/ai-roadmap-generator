"use client";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Wand } from "lucide-react";

interface Props {
  onClick: (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => Promise<string | number | undefined>;
  disabled: boolean;
}

const GenerateButton = ({ disabled, onClick }: Props) => {
  return (
    <Button onClick={onClick} disabled={disabled} type="submit">
      {disabled ? (
        <>
          <LoaderCircle size={20} className="animate-spin" />
          <span className="ml-2 hidden sm:inline">Generating</span>
        </>
      ) : (
        <>
          <Wand size={20} />
          <span className="ml-2 hidden md:inline">Generate</span>
        </>
      )}
    </Button>
  );
};

export default GenerateButton;
