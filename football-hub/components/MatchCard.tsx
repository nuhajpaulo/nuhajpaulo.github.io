import Link from "next/link";
import { Match } from "@/lib/types";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <Link href={`/match/${match.id}`} className="block rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:-translate-y-0.5 hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-500/10">
      <div className="mb-3 flex items-center justify-between text-xs text-zinc-400">
        <span>{match.league}</span>
        <span>{match.status === "LIVE" ? `${match.minute}'` : match.kickoff}</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span>{match.homeTeam.name}</span>
          <strong>{match.score.home}</strong>
        </div>
        <div className="flex items-center justify-between">
          <span>{match.awayTeam.name}</span>
          <strong>{match.score.away}</strong>
        </div>
      </div>
      <div className="mt-3 text-xs text-zinc-500">{match.status}</div>
    </Link>
  );
}

