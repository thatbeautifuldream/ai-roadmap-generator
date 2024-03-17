import { create } from "zustand";

type drawerDetails = {
  query: string;
  parent: string;
  child: string;
};

interface UIState {
  drawerOpen: boolean;
  // setDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void; // added toggle action
}

export const useUIStore = create<UIState>((set) => ({
  drawerOpen: false,
  toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
}));
