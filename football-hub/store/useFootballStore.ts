"use client";

import { create } from "zustand";

interface FootballStore {
  favoriteTeams: string[];
  theme: "dark" | "light";
  setFavorites: (teams: string[]) => void;
  toggleFavorite: (team: string) => void;
  setTheme: (theme: "dark" | "light") => void;
}

const FAVORITES_KEY = "football-hub-favorites";
const THEME_KEY = "football-hub-theme";

export const useFootballStore = create<FootballStore>((set, get) => ({
  favoriteTeams: [],
  theme: "dark",
  setFavorites: (teams) => set({ favoriteTeams: teams }),
  toggleFavorite: (team) => {
    const current = get().favoriteTeams;
    const updated = current.includes(team) ? current.filter((t) => t !== team) : [...current, team];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    set({ favoriteTeams: updated });
  },
  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    set({ theme });
  },
}));

export const storageKeys = { FAVORITES_KEY, THEME_KEY };

