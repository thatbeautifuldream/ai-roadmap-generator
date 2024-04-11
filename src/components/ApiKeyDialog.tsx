"use client";
import ModelSelect from "@/components/flow-components/model-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { UModel, useUIStore } from "@/lib/stores";
import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  disabled: boolean;
}

const ApiKeyDialog = ({ disabled }: Props) => {
  const [apiKey, setApiKey] = useState("");

  const { setModelApiKey, model, setModel } = useUIStore((state) => ({
    setModelApiKey: state.setModelApiKey,
    modelApiKey: state.modelApiKey,
    model: state.model,
    setModel: state.setModel,
  }));

  useEffect(() => {
    const initializeApiKeys = () => {
      const existingGroqKey = localStorage.getItem("GROQ_API_KEY");
      const existingOpenAIKey = localStorage.getItem("OPENAI_API_KEY");
      const existingGeminiKey = localStorage.getItem("GEMINI_API_KEY");
      const existingCohereKey = localStorage.getItem("COHERE_API_KEY");

      if (!existingGroqKey) {
        localStorage.setItem("GROQ_API_KEY", "");
      }
      if (!existingOpenAIKey) {
        localStorage.setItem("OPENAI_API_KEY", "");
      }
      if (!existingGeminiKey) {
        localStorage.setItem("GEMINI_API_KEY", "");
      }
      if (!existingCohereKey) {
        localStorage.setItem("COHERE_API_KEY", "");
      }
    };

    initializeApiKeys();

    const groqKey = localStorage.getItem("GROQ_API_KEY");
    const openAIKey = localStorage.getItem("OPENAI_API_KEY");
    const geminiKey = localStorage.getItem("GEMINI_API_KEY");
    const cohereKey = localStorage.getItem("COHERE_API_KEY");

    if (model === "groq") {
      setApiKey(groqKey || "");
    } else if (model === "openai") {
      setApiKey(openAIKey || "");
    } else if (model === "gemini") {
      setApiKey(geminiKey || "");
    } else if (model === "cohere") {
      setApiKey(cohereKey || "");
    }
  }, [model]);

  const setApiKeys = () => {
    if (model === "groq") {
      localStorage.setItem("GROQ_API_KEY", apiKey);
    } else if (model === "openai") {
      localStorage.setItem("OPENAI_API_KEY", apiKey);
    } else if (model === "gemini") {
      localStorage.setItem("GEMINI_API_KEY", apiKey);
    } else if (model === "cohere") {
      localStorage.setItem("COHERE_API_KEY", apiKey);
    }
  };

  const onSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiKeys();
    setModelApiKey(apiKey);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <KeyRound size={16} />
          <span className="ml-2 hidden md:inline">Add Key</span>
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">
              Add your{" "}
              <span className="relative inline-block">
                <span
                  className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent blur-md"
                  aria-hidden="true"
                >
                  {model.toUpperCase()}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  {model.toUpperCase()}
                </span>
              </span>{" "}
              API Key.
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={onSave}>
            <div className="flex flex-row gap-x-2">
              <ModelSelect disabled={false} />
              <Select
                value={model}
                onValueChange={(value) => setModel(value as UModel)}
              >
                <SelectContent>
                  <SelectItem value="groq">Groq</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                  <SelectItem value="cohere">Cohere</SelectItem>
                </SelectContent>
              </Select>
              <Input
                onChange={(e) => setApiKey(e.target.value)}
                value={apiKey}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <DialogClose asChild>
                <Button type="submit">Save</Button>
              </DialogClose>

              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default ApiKeyDialog;
