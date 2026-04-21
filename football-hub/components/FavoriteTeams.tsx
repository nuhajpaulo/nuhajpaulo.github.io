"use client";

import { useEffect } from "react";
import { storageKeys, useFootballStore } from "@/store/useFootballStore";

const teamPool = ["Arsenal", "Liverpool", "Barcelona", "Real Madrid", "Man City", "PSG"];

export function FavoriteTeams() {
  const { favoriteTeams, setFavorites, toggleFavorite } = useFootballStore();

  useEffect(() => {
    const saved = localStorage.getItem(storageKeys.FAVORITES_KEY);
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, [setFavorites]);

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
      <h3 className="text-lg font-semibold">Favorite Teams</h3>
      <p className="mt-1 text-sm text-zinc-400">Customize your dashboard feed</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {teamPool.map((team) => {
          const active = favoriteTeams.includes(team);
          return (
            <button key={team} onClick={() => toggleFavorite(team)} className={`rounded-full px-3 py-1.5 text-sm ${active ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-300"}`}>
              {team}
            </button>
          );
        })}
      </div>
    </div>
  );
}

