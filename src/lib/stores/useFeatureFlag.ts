import { create } from "zustand";

interface FeatureFlag {
  [key: string]: {
    enabled: boolean;
    description?: string;
  };
}

interface FeatureFlagState {
  flags: FeatureFlag;
  toggleFlag: (key: string) => void;
  enableFlag: (key: string) => void;
  disableFlag: (key: string) => void;
}

export const useFeatureFlagStore = create<FeatureFlagState>((set) => ({
  flags: {
    "roadmap-pricing": {
      enabled: false,
      description: "Display the Roadmap Pricing section",
    },
  },
  toggleFlag: (key) =>
    set((state) => ({
      flags: {
        ...state.flags,
        [key]: {
          ...state.flags[key],
          enabled: !state.flags[key].enabled,
        },
      },
    })),
  enableFlag: (key) =>
    set((state) => ({
      flags: {
        ...state.flags,
        [key]: {
          ...state.flags[key],
          enabled: true,
        },
      },
    })),
  disableFlag: (key) =>
    set((state) => ({
      flags: {
        ...state.flags,
        [key]: {
          ...state.flags[key],
          enabled: false,
        },
      },
    })),
}));
