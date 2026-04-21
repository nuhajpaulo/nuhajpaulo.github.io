import { liveMatches, upcomingMatches } from "@/lib/mockData";
import { Match } from "@/lib/types";

const RAPID_HOST =
  process.env.RAPIDAPI_HOST ?? "free-api-live-football-data.p.rapidapi.com";
const RAPID_BASE_URL =
  process.env.RAPIDAPI_BASE_URL ?? "https://free-api-live-football-data.p.rapidapi.com";
const RAPID_KEY = process.env.RAPIDAPI_KEY;

const LIVE_ENDPOINT = process.env.RAPIDAPI_LIVE_ENDPOINT ?? "/football-current-live";
const DETAILS_ENDPOINT =
  process.env.RAPIDAPI_MATCH_DETAILS_ENDPOINT ?? "/football-match-details";
const PLAYER_SEARCH_ENDPOINT =
  process.env.RAPIDAPI_PLAYER_SEARCH_ENDPOINT ?? "/football-players-search";
const PLAYER_DETAIL_ENDPOINT =
  process.env.RAPIDAPI_PLAYER_DETAIL_ENDPOINT ?? "/football-get-player-detail";
const EVENT_STATS_ENDPOINT =
  process.env.RAPIDAPI_EVENT_STATS_ENDPOINT ?? "/football-get-match-event-all-stats";
const HOME_LINEUP_ENDPOINT =
  process.env.RAPIDAPI_HOME_LINEUP_ENDPOINT ?? "/football-get-hometeam-lineup";
const TRENDING_NEWS_ENDPOINT =
  process.env.RAPIDAPI_TRENDING_NEWS_ENDPOINT ?? "/football-get-trendingnews";
const MATCHES_BY_DATE_ENDPOINT =
  process.env.RAPIDAPI_MATCHES_BY_DATE_ENDPOINT ?? "/football-get-matches-by-date";
const MATCHES_BY_DATE_AND_LEAGUE_ENDPOINT =
  process.env.RAPIDAPI_MATCHES_BY_DATE_AND_LEAGUE_ENDPOINT ??
  "/football-get-matches-by-date-and-league";
const MATCHES_BY_LEAGUE_ENDPOINT =
  process.env.RAPIDAPI_MATCHES_BY_LEAGUE_ENDPOINT ??
  "/football-get-all-matches-by-league";

type UnknownRecord = Record<string, unknown>;

let matchesCache: { at: number; data: Match[] } | null = null;
const LIVE_CACHE_MS = 30_000;

function toNum(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function safeText(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function withQuery(
  path: string,
  params?: Record<string, string | number | undefined>
): string {
  if (!params) return path;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value).trim()) {
      query.set(key, String(value));
    }
  }
  const qs = query.toString();
  return qs ? `${path}?${qs}` : path;
}

function isRecord(value: unknown): value is UnknownRecord {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function parseMinute(item: UnknownRecord): number {
  const statusObj = isRecord(item.status) ? item.status : null;
  const liveTime = statusObj && isRecord(statusObj.liveTime) ? statusObj.liveTime : null;

  const long = safeText(liveTime?.long, "");
  if (long.includes(":")) {
    return toNum(long.split(":")[0], 0);
  }

  const short = safeText(liveTime?.short, "");
  const shortMinute = Number(short.replace(/[^0-9]/g, ""));
  if (Number.isFinite(shortMinute) && shortMinute > 0) {
    return shortMinute;
  }

  return toNum(item.minute ?? item.elapsed, 0);
}

function parseMatchStatus(item: UnknownRecord): "LIVE" | "UPCOMING" | "FT" {
  const statusObj = isRecord(item.status) ? item.status : null;
  if (!statusObj) return "UPCOMING";

  if (statusObj.finished === true) return "FT";
  if (statusObj.ongoing === true || statusObj.started === true) return "LIVE";
  return "UPCOMING";
}

function parseLeague(item: UnknownRecord): string {
  const name = safeText(
    item.leagueName ?? item.league_name ?? item.league,
    ""
  );
  if (name) return name;

  const leagueId = item.leagueId ?? item.league_id;
  if (leagueId !== undefined && leagueId !== null) {
    return `League ${String(leagueId)}`;
  }

  return "Unknown League";
}

function mapUnknownToMatch(item: UnknownRecord, index: number): Match {
  const homeObj = isRecord(item.home) ? item.home : null;
  const awayObj = isRecord(item.away) ? item.away : null;

  const homeName = safeText(homeObj?.name ?? item.home_name ?? item.homeTeamName, "Home Team");
  const awayName = safeText(awayObj?.name ?? item.away_name ?? item.awayTeamName, "Away Team");

  const homeScore = toNum(homeObj?.score ?? item.home_score ?? item.homeScore, 0);
  const awayScore = toNum(awayObj?.score ?? item.away_score ?? item.awayScore, 0);

  const id = safeText(item.id ?? item.match_id ?? item.matchId, `rapid-${index + 1}`);
  const status = parseMatchStatus(item);
  const minute = status === "LIVE" ? parseMinute(item) : 0;

  return {
    id,
    league: parseLeague(item),
    leagueId:
      item.leagueId !== undefined && item.leagueId !== null
        ? String(item.leagueId)
        : undefined,
    homeTeam: { name: homeName, logo: "" },
    awayTeam: { name: awayName, logo: "" },
    score: { home: homeScore, away: awayScore },
    minute,
    status,
    kickoff: safeText(item.time ?? item.kickoff, "TBD"),
    stats: {
      possession: { home: 50, away: 50 },
      shots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
    },
    timeline: [],
    form: { home: [1, 0, 1, 1, 0], away: [0, 1, 1, 0, 1] },
  };
}

async function rapidFetch(pathWithQuery: string): Promise<unknown> {
  if (!RAPID_KEY) {
    throw new Error("RAPIDAPI_KEY is missing");
  }

  const res = await fetch(`${RAPID_BASE_URL}${pathWithQuery}`, {
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": RAPID_HOST,
      "x-rapidapi-key": RAPID_KEY,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Rapid API failed: ${res.status}`);
  }

  return res.json();
}

function pickMatches(payload: unknown): UnknownRecord[] {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) return [];

  const response = isRecord(payload.response) ? payload.response : payload;
  const candidates: unknown[] = [
    response.live,
    response.upcoming,
    response.fixtures,
    response.matches,
    response.results,
    payload.data,
    payload.matches,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter(isRecord);
    }
  }

  if (Array.isArray(response)) {
    const flattened = response
      .filter(isRecord)
      .flatMap((group) =>
        Array.isArray(group.matches) ? group.matches.filter(isRecord) : []
      );
    if (flattened.length) {
      return flattened;
    }
  }

  if (isRecord(response) && Array.isArray(response.matches)) {
    return response.matches.filter(isRecord);
  }

  return [];
}

async function getApiMatches(): Promise<Match[]> {
  const now = Date.now();
  if (matchesCache && now - matchesCache.at < LIVE_CACHE_MS) {
    return matchesCache.data;
  }

  const payload = await rapidFetch(LIVE_ENDPOINT);
  const list = pickMatches(payload);
  const mapped = list.map(mapUnknownToMatch);
  matchesCache = { at: now, data: mapped };
  return mapped;
}

function getDateYYYYMMDD(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export async function getMatchesByDateRaw(date?: string): Promise<unknown> {
  return rapidFetch(
    withQuery(MATCHES_BY_DATE_ENDPOINT, { date: date ?? getDateYYYYMMDD() })
  );
}

export async function getMatchesByDateAndLeagueRaw(
  date?: string,
  leagueId?: string
): Promise<unknown> {
  return rapidFetch(
    withQuery(MATCHES_BY_DATE_AND_LEAGUE_ENDPOINT, {
      date: date ?? getDateYYYYMMDD(),
      leagueid: leagueId,
    })
  );
}

export async function getMatchesByLeagueRaw(leagueId: string): Promise<unknown> {
  return rapidFetch(withQuery(MATCHES_BY_LEAGUE_ENDPOINT, { leagueid: leagueId }));
}

export async function getMatchesByDateWithFallback(date?: string): Promise<Match[]> {
  try {
    const payload = await getMatchesByDateRaw(date);
    const list = pickMatches(payload);
    if (!list.length) return upcomingMatches;
    return list.map(mapUnknownToMatch);
  } catch {
    return upcomingMatches;
  }
}

export async function getMatchesByLeagueWithFallback(leagueId?: string): Promise<Match[]> {
  if (!leagueId) return upcomingMatches;
  try {
    const payload = await getMatchesByLeagueRaw(leagueId);
    const list = pickMatches(payload);
    if (!list.length) return upcomingMatches;
    return list.map(mapUnknownToMatch);
  } catch {
    return upcomingMatches;
  }
}

export async function getLiveMatchesWithFallback(): Promise<Match[]> {
  try {
    const matches = await getApiMatches();
    const liveOnly = matches.filter((m) => m.status === "LIVE");
    return liveOnly.length ? liveOnly : matches;
  } catch {
    return liveMatches;
  }
}

export async function getUpcomingMatchesWithFallback(): Promise<Match[]> {
  try {
    const matches = await getMatchesByDateWithFallback();
    const upcomingOnly = matches.filter((m) => m.status === "UPCOMING");
    return upcomingOnly.length ? upcomingOnly : matches;
  } catch {
    return upcomingMatches;
  }
}

export async function getMatchDetailsWithFallback(matchId: string): Promise<Match | null> {
  const live = await getLiveMatchesWithFallback();
  const upcoming = await getUpcomingMatchesWithFallback();
  const fromLists = [...live, ...upcoming].find((m) => m.id === matchId) ?? null;

  try {
    const payload = await rapidFetch(`${DETAILS_ENDPOINT}?matchid=${encodeURIComponent(matchId)}`);
    const list = pickMatches(payload);
    const exact = list.find((item) => String(item.id ?? item.match_id ?? item.matchId) === matchId);

    if (exact) {
      return { ...(fromLists ?? mapUnknownToMatch(exact, 0)), ...mapUnknownToMatch(exact, 0) };
    }

    if (list[0]) {
      return { ...(fromLists ?? mapUnknownToMatch(list[0], 0)), ...mapUnknownToMatch(list[0], 0) };
    }

    return fromLists;
  } catch {
    return fromLists;
  }
}

export async function getTrendingNewsRaw(): Promise<unknown> {
  return rapidFetch(TRENDING_NEWS_ENDPOINT);
}

export async function searchPlayersRaw(search: string): Promise<unknown> {
  return rapidFetch(withQuery(PLAYER_SEARCH_ENDPOINT, { search }));
}

export async function getPlayerDetailRaw(playerid: string): Promise<unknown> {
  return rapidFetch(withQuery(PLAYER_DETAIL_ENDPOINT, { playerid }));
}

export async function getEventStatsRaw(eventid: string): Promise<unknown> {
  return rapidFetch(withQuery(EVENT_STATS_ENDPOINT, { eventid }));
}

export async function getHomeLineupRaw(eventid: string): Promise<unknown> {
  return rapidFetch(withQuery(HOME_LINEUP_ENDPOINT, { eventid }));
}
