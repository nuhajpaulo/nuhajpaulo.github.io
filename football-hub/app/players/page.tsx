"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { PlayerCard } from "@/components/PlayerCard";
import { footballApi } from "@/lib/api";
import { Player } from "@/lib/types";

const PlayerCompareChart = dynamic(
  () => import("@/components/PlayerCompareChart").then((mod) => mod.PlayerCompareChart),
  { ssr: false }
);

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  useEffect(() => {
    footballApi.players().then((data) => {
      setPlayers(data);
      setA(data[0]?.id || "");
      setB(data[1]?.id || "");
    });
  }, []);

  const playerA = players.find((player) => player.id === a);
  const playerB = players.find((player) => player.id === b);

  const chartData = useMemo(() => {
    if (!playerA || !playerB) return [];
    return [
      { stat: "Goals", playerA: playerA.goals, playerB: playerB.goals },
      { stat: "Assists", playerA: playerA.assists, playerB: playerB.assists },
      { stat: "Matches", playerA: playerA.matches, playerB: playerB.matches },
      { stat: "Min/Goal", playerA: playerA.minutesPerGoal, playerB: playerB.minutesPerGoal },
    ];
  }, [playerA, playerB]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Player Compare Tool</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <select value={a} onChange={(e) => setA(e.target.value)} className="rounded-lg border border-white/10 bg-zinc-900 p-2">
          {players.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}
        </select>
        <select value={b} onChange={(e) => setB(e.target.value)} className="rounded-lg border border-white/10 bg-zinc-900 p-2">
          {players.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}
        </select>
      </div>

      {playerA && <PlayerCard player={playerA} />}
      {playerB && <PlayerCard player={playerB} />}
      <PlayerCompareChart data={chartData} />
    </div>
  );
}

