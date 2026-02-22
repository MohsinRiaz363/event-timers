import { create } from "zustand";

interface AppState {
  siteTitle: string;
  isUrdu: boolean;
  activeEventId: string | null;
  setActiveEventId: (id: string | null) => void;
  setSiteTitle: (title: string) => void;
  setUrduMode: (bool: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  siteTitle: "Make your Timer",
  isUrdu: false,
  activeEventId: null,
  setActiveEventId: (id) => set({ activeEventId: id }),
  setSiteTitle: (title) => set({ siteTitle: title }),
  setUrduMode: (bool) => set({ isUrdu: bool }),
}));
