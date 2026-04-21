"use client";

import { useEffect, useState } from "react";
import { StatBar } from "@/components/StatBar";
import { footballApi } from "@/lib/api";
import { getPrediction } from "@/lib/prediction";
import { Match } from "@/lib/types";

export default function MatchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [match, setMatch] = useState<Match | null>(null);

  useEffect(() => {
    const load = async () => {
      const { id } = await params;
      const data = await footballApi.matchDetail(id);
      setMatch(data);
    };
    load();
  }, [params]);

  if (!match) return <div className="animate-pulse rounded-2xl bg-zinc-800 p-10" />;

  const prediction = getPrediction(match);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6">
        <h1 className="text-2xl font-bold">{match.homeTeam.name} vs {match.awayTeam.name}</h1>
        <p className="mt-1 text-zinc-400">{match.league} · {match.status}</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/70 p-6">
        <h2 className="text-xl font-semibold">Match Stats</h2>
        <StatBar label="Possession" home={match.stats.possession.home} away={match.stats.possession.away} />
        <StatBar label="Shots" home={match.stats.shots.home} away={match.stats.shots.away} />
        <StatBar label="Shots on Target" home={match.stats.shotsOnTarget.home} away={match.stats.shotsOnTarget.away} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6">
        <h2 className="mb-3 text-xl font-semibold">Timeline</h2>
        <div className="space-y-2">
          {match.timeline.map((event, index) => (
            <div key={`${event.minute}-${index}`} className="rounded-lg bg-zinc-950 p-3 text-sm">
              {event.minute}&apos; - {event.player} ({event.type})
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6">
        <h2 className="text-xl font-semibold">AI Prediction</h2>
        <p className="mt-2">Winner: {prediction.winner}</p>
        <p className="text-zinc-300">Probability: {prediction.probability}</p>
      </div>
    </div>
  );
}

