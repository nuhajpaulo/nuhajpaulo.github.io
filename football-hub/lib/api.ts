import { Match, NewsItem, Player, TransferItem } from "@/lib/types";

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }
  return res.json();
}

export const footballApi = {
  live: () => getJson<Match[]>("/api/live"),
  upcoming: () => getJson<Match[]>("/api/upcoming"),
  news: () => getJson<NewsItem[]>("/api/news"),
  players: (search?: string) =>
    getJson<Player[]>(search ? `/api/players?search=${encodeURIComponent(search)}` : "/api/players"),
  playersSearchRaw: (search: string) =>
    getJson<unknown>(`/api/players/search?search=${encodeURIComponent(search)}`),
  playerDetailRaw: (id: string) => getJson<unknown>(`/api/players/${encodeURIComponent(id)}`),
  eventStatsRaw: (id: string) => getJson<unknown>(`/api/events/${encodeURIComponent(id)}/stats`),
  homeLineupRaw: (id: string) => getJson<unknown>(`/api/events/${encodeURIComponent(id)}/lineup`),
  matchesByDate: (date?: string) =>
    getJson<Match[]>(date ? `/api/matches/by-date?date=${encodeURIComponent(date)}` : "/api/matches/by-date"),
  matchesByDateAndLeagueRaw: (date?: string, leagueid?: string) => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (leagueid) params.set("leagueid", leagueid);
    const qs = params.toString();
    return getJson<unknown>(`/api/matches/by-date-and-league${qs ? `?${qs}` : ""}`);
  },
  matchesByLeague: (leagueid: string) =>
    getJson<Match[]>(`/api/matches/by-league?leagueid=${encodeURIComponent(leagueid)}`),
  transfers: () => getJson<TransferItem[]>("/api/transfers"),
  predictions: () => getJson<Array<{ matchId: string; winner: string; probability: string }>>("/api/predictions"),
  matchDetail: (id: string) => getJson<Match>(`/api/match/${id}`),
};

