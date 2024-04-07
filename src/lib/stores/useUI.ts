import { create } from "zustand";

type drawerDetails = {
  query: string;
  parent: string;
  child: string;
};

export type UModel = "openai" | "cohere" | "gemini" | "groq";

interface UIState {
  drawerOpen: boolean;
  toggleDrawer: () => void;
  drawerDetails: drawerDetails | null;
  setDrawerDetails: ({ query, parent, child }: drawerDetails) => void;
  model: UModel;
  setModel: (model: UModel) => void;
  query: string;
  setQuery: (query: string) => void;
  mainQuery: string;
  setMainQuery: (query: string) => void;
  modelApiKey: string | null;
  setModelApiKey: (query: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  drawerOpen: false,
  toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
  drawerDetails: null,
  setDrawerDetails: (data) => set(() => ({ drawerDetails: data })),
  model: "groq",
  setModel: (model) => set(() => ({ model })),
  query: "",
  setQuery: (query) => set(() => ({ query })),
  mainQuery: "",
  setMainQuery: (mainQuery) => set(() => ({ mainQuery })),
  modelApiKey: "",
  setModelApiKey: (modelApiKey) => set(() => ({ modelApiKey })),
}));
