import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createCohere } from "@ai-sdk/cohere";

export type Provider = "openai" | "gemini" | "cohere" | "groq";

const MODEL_MAP: Record<Provider, string> = {
  openai: "gpt-4o-mini",
  gemini: "gemini-1.5-flash",
  cohere: "command-r",
  groq: "llama-3.1-70b-versatile",
};

export function getModel(provider: Provider, apiKey?: string | null) {
  const key = apiKey || undefined;

  switch (provider) {
    case "openai": {
      const openai = createOpenAI({
        apiKey: key || process.env.OPENAI_API_KEY,
      });
      return openai(MODEL_MAP.openai);
    }
    case "gemini": {
      const google = createGoogleGenerativeAI({
        apiKey: key || process.env.GOOGLE_API_KEY,
      });
      return google(MODEL_MAP.gemini);
    }
    case "cohere": {
      const cohere = createCohere({
        apiKey: key || process.env.COHERE_API_KEY,
      });
      return cohere(MODEL_MAP.cohere);
    }
    case "groq": {
      // Groq uses OpenAI-compatible API
      const groq = createOpenAI({
        apiKey: key || process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
      });
      return groq(MODEL_MAP.groq);
    }
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
