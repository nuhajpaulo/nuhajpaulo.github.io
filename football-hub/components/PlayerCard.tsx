import { Player } from "@/lib/types";

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
      <h3 className="text-lg font-semibold">{player.name}</h3>
      <p className="text-sm text-zinc-400">{player.team} · {player.position}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>Goals: {player.goals}</div>
        <div>Assists: {player.assists}</div>
        <div>Matches: {player.matches}</div>
        <div>Min/Goal: {player.minutesPerGoal}</div>
      </div>
    </div>
  );
}

