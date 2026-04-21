"use client";

import { useCallback, useMemo, useState } from "react";
import { LeagueFilter } from "@/components/LeagueFilter";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { MatchCard } from "@/components/MatchCard";
import { usePolling } from "@/hooks/usePolling";
import { footballApi } from "@/lib/api";
import { Match } from "@/lib/types";

export default function LivePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [todayMatches, setTodayMatches] = useState<Match[]>([]);
  const [league, setLeague] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchLive = useCallback(async () => {
    const [liveData, dayData] = await Promise.all([
      footballApi.live(),
      footballApi.matchesByDate(),
    ]);
    setMatches(liveData);
    setTodayMatches(dayData);
    setLoading(false);
  }, []);

  usePolling(fetchLive, 30000);

  const filtered = useMemo(() => {
    if (league === "All") return matches;
    return matches.filter((match) => match.league === league);
  }, [league, matches]);

  const leagueOptions = useMemo(
    () =>
      Array.from(
        new Set([...matches, ...todayMatches].map((match) => match.league))
      ).filter(Boolean),
    [matches, todayMatches]
  );

  const leagueIdByName = useMemo(() => {
    const map = new Map<string, string>();
    for (const match of [...matches, ...todayMatches]) {
      if (match.league && match.leagueId && !map.has(match.league)) {
        map.set(match.league, match.leagueId);
      }
    }
    return map;
  }, [matches, todayMatches]);

  const filteredToday = useMemo(() => {
    if (league === "All") return todayMatches;
    return todayMatches.filter((match) => match.league === league);
  }, [league, todayMatches]);

  const handleLeagueChange = useCallback(
    async (nextLeague: string) => {
      setLeague(nextLeague);
      if (nextLeague === "All") {
        return;
      }

      const leagueId = leagueIdByName.get(nextLeague);
      if (!leagueId) {
        return;
      }

      const data = await footballApi.matchesByLeague(leagueId);
      setTodayMatches(data);
    },
    [leagueIdByName]
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Live Scores</h1>
      <LeagueFilter value={league} onChange={handleLeagueChange} options={leagueOptions} />
      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <>
          {filtered.length ? (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Live Now</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 text-zinc-300">
              No live matches available right now from the API.
            </div>
          )}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Today Matches</h2>
            {filteredToday.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredToday.slice(0, 20).map((match) => (
                  <MatchCard key={`day-${match.id}`} match={match} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 text-zinc-300">
                No matches found for the selected league on this date.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

