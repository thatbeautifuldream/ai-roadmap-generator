export const availableModels = [
  { key: "groq", label: "Groq" },
  { key: "openai", label: "Open AI" },
  { key: "gemini", label: "Gemini" },
  { key: "cohere", label: "Cohere" },
];

export const modelKeys = availableModels.map((model) => model.key);

export const proOptions = { account: "paid-pro", hideAttribution: true };
