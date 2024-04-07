export const availableModels = [
  { key: "groq", label: "Groq" },
  { key: "openai", label: "OpenAI" },
  { key: "gemini", label: "Gemini" },
  { key: "cohere", label: "Cohere" },
];

export const modelKeys = availableModels.map((model) => model.key);

export const proOptions = { account: "paid-pro", hideAttribution: true };
