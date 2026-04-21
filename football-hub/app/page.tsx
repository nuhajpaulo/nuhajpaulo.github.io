import { FavoriteTeams } from "@/components/FavoriteTeams";
import { GuessPlayerGame } from "@/components/GuessPlayerGame";
import { MatchCard } from "@/components/MatchCard";
import { news } from "@/lib/mockData";
import { getLiveMatchesWithFallback, getUpcomingMatchesWithFallback } from "@/lib/rapidFootball";

export default async function HomePage() {
  const [liveMatches, upcomingMatches] = await Promise.all([
    getLiveMatchesWithFallback(),
    getUpcomingMatchesWithFallback(),
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Football Hub Dashboard</h1>
        <p className="mt-2 text-zinc-400">Live action, predictions, transfers, and personalized football updates.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <FavoriteTeams />
        <GuessPlayerGame />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Live Scores</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {liveMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Upcoming Matches</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {upcomingMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
          <h2 className="mb-3 text-xl font-semibold">Trending News</h2>
          <div className="space-y-3">
            {news.map((item) => (
              <article key={item.id} className="rounded-lg bg-zinc-950 p-3">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-xs text-zinc-500">{item.source} · {item.timeAgo}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
          <h2 className="mb-3 text-xl font-semibold">Top Leagues</h2>
          <div className="space-y-2 text-zinc-300">
            <div className="rounded-lg bg-zinc-950 p-3">Premier League</div>
            <div className="rounded-lg bg-zinc-950 p-3">Champions League</div>
            <div className="rounded-lg bg-zinc-950 p-3">La Liga</div>
          </div>
        </div>
      </section>
    </div>
  );
}

