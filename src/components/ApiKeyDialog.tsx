import { useUIStore } from "@/lib/stores";
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
import { toProperCase } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Props {
  disabled: boolean;
}

const ApiKeyDialog = ({ disabled }: Props) => {
  const [apiKey, setApiKey] = useState("");
  const [apiKeyType, setApiKeyType] = useState("groq");

  const { setModelApiKey, model } = useUIStore((state) => ({
    setModelApiKey: state.setModelApiKey,
    modelApiKey: state.modelApiKey,
    model: state.model,
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
  }, [model]); // This useEffect runs when the model changes

  const setApiKeys = () => {
    if (apiKeyType === "groq") {
      localStorage.setItem("GROQ_API_KEY", apiKey);
    } else if (apiKeyType === "openai") {
      localStorage.setItem("OPENAI_API_KEY", apiKey);
    } else if (apiKeyType === "gemini") {
      localStorage.setItem("GEMINI_API_KEY", apiKey);
    } else if (apiKeyType === "cohere") {
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
        <Button disabled={disabled}>Add Key</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Add your own API Key.</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSave}>
            <div className="grid gap-4">
              <div>
                <span className="font-semibold">
                  {toProperCase(model)} API Key
                </span>
                <Select
                  value={apiKeyType}
                  onValueChange={(value) => setApiKeyType(value)}
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
