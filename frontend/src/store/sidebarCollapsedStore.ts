
import { create } from "zustand";

interface SidebarCollapsedState {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export const useSidebarCollapsedStore = create<SidebarCollapsedState>((set) => ({
  collapsed: false, // default: sidebar expanded
  setCollapsed: (value) => set({ collapsed: value }),
}));