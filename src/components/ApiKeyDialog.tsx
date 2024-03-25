"use client";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogPortal,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/app/stores/useUI";

const ApiKeyDialog = () => {
  const [openAIKey, setOpenAIKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [cohereKey, setCohereKey] = useState("");

  const { modelApiKey, setModelApiKey, model } = useUIStore((state) => ({
    setModelApiKey: state.setModelApiKey,
    modelApiKey: state.modelApiKey,
    model: state.model,
  }));

  const setApiKeys = () => {
    localStorage.setItem("OPENAI_API_KEY", openAIKey);
    localStorage.setItem("GEMINI_API_KEY", geminiKey);
    localStorage.setItem("COHERE_API_KEY", cohereKey);
  }

  useEffect(() => {
    setApiKeys();
    const openAIKey = localStorage.getItem("OPENAI_API_KEY");
    const geminiKey = localStorage.getItem("GEMINI_API_KEY");
    const cohereKey = localStorage.getItem("COHERE_API_KEY");

    setOpenAIKey(openAIKey || "");
    setGeminiKey(geminiKey || "");
    setCohereKey(cohereKey || "");
  }, []);

  const onSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiKeys();

    if (model === "openai") {
      setModelApiKey(openAIKey);
    }
    if (model === "gemini") {
      setModelApiKey(geminiKey);
    }
    if (model === "cohere") {
      setModelApiKey(cohereKey);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Key</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">
              Add your own API Keys.
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={onSave}>
            <div className="grid gap-4">
              <div>
                <span className="font-semibold">OpenAI API Key</span>
                <Input
                  onChange={(e) => setOpenAIKey(e.target.value)}
                  value={openAIKey}
                  className="mt-2"
                />
              </div>
              <div>
                <span className="font-semibold">Gemini API Key</span>
                <Input
                  onChange={(e) => setGeminiKey(e.target.value)}
                  value={geminiKey}
                  className="mt-2"
                />
              </div>
              <div>
                <span className="font-semibold">Cohere API Key</span>
                <Input
                  onChange={(e) => setCohereKey(e.target.value)}
                  value={cohereKey}
                  className="mt-2"
                />
              </div>
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
