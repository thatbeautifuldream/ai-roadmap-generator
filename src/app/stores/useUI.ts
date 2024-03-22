import { create } from 'zustand';

type drawerDetails = {
  query: string,
  parent: string,
  child: string,
}

export type UModel = 'openai' | 'cohere' | 'gemini'

interface UIState {
  drawerOpen: boolean;
  toggleDrawer: () => void;
  drawerDetails: drawerDetails | null,
  setDrawerDetails: ({
    query,
    parent,
    child
  }: drawerDetails) => void,
  model: UModel,
  setModel: (model: UModel) => void,
  query: string,
  setQuery: (query: string) => void
  mainQuery: string,
  setMainQuery: (query: string) => void,
  modelApiKey: string,
  setModelApiKey: (query: string) => void
}


export const useUIStore = create<UIState>((set) => ({
  drawerOpen: false,
  toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
  drawerDetails: null,
  setDrawerDetails: (data) => set(() => ({ drawerDetails: data })),
  model: 'openai',
  setModel: (model) => set(() => ({ model })),
  query: '',
  setQuery: (query) => set(() => ({ query })),
  mainQuery: '',
  setMainQuery: (mainQuery) => set(() => ({ mainQuery })),
  modelApiKey: '',
  setModelApiKey: (modelApiKey) => set(() => ({ modelApiKey })),
}))