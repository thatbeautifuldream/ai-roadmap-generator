import { create } from 'zustand'

type drawerDetails = {
  query: string,
  parent: string,
  child: string,
}

interface UIState {
  drawerOpen: boolean;
  toggleDrawer: () => void;
  drawerDetails: drawerDetails | null,
  setDrawerDetails: ({
    query,
    parent,
    child
  }: drawerDetails) => void
}


export const useUIStore = create<UIState>((set) => ({
  drawerOpen: false,
  toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
  drawerDetails: null,
  setDrawerDetails: (data) => set(() => ({ drawerDetails: data })),
}))