import { create } from "zustand";

interface AppState {
  siteTitle: string;
  isUrdu: boolean; // New state
  setSiteTitle: (title: string) => void;
  setUrduMode: (bool: boolean) => void; // New setter
}

export const useAppStore = create<AppState>((set) => ({
  siteTitle: "Make your Timer",
  isUrdu: false, // Default to English
  setSiteTitle: (title) => set({ siteTitle: title }),
  setUrduMode: (bool) => set({ isUrdu: bool }),
}));
