import { Match, NewsItem, Player, TransferItem } from "@/lib/types";

export const leagues = ["Premier League", "Champions League", "La Liga"] as const;

export const liveMatches: Match[] = [
  {
    id: "m1",
    league: "Premier League",
    homeTeam: { name: "Arsenal", logo: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=64&q=80" },
    awayTeam: { name: "Liverpool", logo: "https://images.unsplash.com/photo-1543357480-c60d400e2ef9?w=64&q=80" },
    score: { home: 2, away: 1 },
    minute: 67,
    status: "LIVE",
    kickoff: "19:45",
    stats: { possession: { home: 54, away: 46 }, shots: { home: 12, away: 10 }, shotsOnTarget: { home: 6, away: 3 } },
    timeline: [
      { minute: 13, team: "home", type: "goal", player: "Bukayo Saka" },
      { minute: 31, team: "away", type: "goal", player: "Darwin Nunez" },
      { minute: 56, team: "away", type: "yellow", player: "Alexis Mac Allister" },
      { minute: 62, team: "home", type: "goal", player: "Martin Odegaard" },
    ],
    form: { home: [1, 1, 0, 1, 1], away: [1, 0, 1, 1, 0] },
  },
  {
    id: "m2",
    league: "La Liga",
    homeTeam: { name: "Barcelona", logo: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=64&q=80" },
    awayTeam: { name: "Real Madrid", logo: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=64&q=80" },
    score: { home: 0, away: 0 },
    minute: 38,
    status: "LIVE",
    kickoff: "20:00",
    stats: { possession: { home: 60, away: 40 }, shots: { home: 7, away: 4 }, shotsOnTarget: { home: 2, away: 1 } },
    timeline: [{ minute: 24, team: "home", type: "yellow", player: "Gavi" }],
    form: { home: [1, 1, 1, 0, 1], away: [1, 1, 1, 1, 1] },
  },
];

export const upcomingMatches: Match[] = [
  { ...liveMatches[0], id: "m3", status: "UPCOMING", minute: 0, score: { home: 0, away: 0 }, kickoff: "Tomorrow 18:30" },
  { ...liveMatches[1], id: "m4", status: "UPCOMING", minute: 0, score: { home: 0, away: 0 }, kickoff: "Tomorrow 21:00" },
];

export const news: NewsItem[] = [
  { id: "n1", title: "Champions League race tightens after weekend thriller", source: "Football Insider", timeAgo: "1h ago" },
  { id: "n2", title: "Manager confirms tactical switch for title run-in", source: "The Athletic", timeAgo: "2h ago" },
  { id: "n3", title: "Young star signs long-term contract extension", source: "Sky Sports", timeAgo: "4h ago" },
];

export const players: Player[] = [
  { id: "p1", name: "Erling Haaland", team: "Man City", nationality: "Norway", position: "ST", goals: 28, assists: 6, matches: 31, minutesPerGoal: 92 },
  { id: "p2", name: "Kylian Mbappe", team: "PSG", nationality: "France", position: "ST", goals: 26, assists: 8, matches: 30, minutesPerGoal: 95 },
  { id: "p3", name: "Jude Bellingham", team: "Real Madrid", nationality: "England", position: "AM", goals: 19, assists: 10, matches: 33, minutesPerGoal: 137 },
  { id: "p4", name: "Mohamed Salah", team: "Liverpool", nationality: "Egypt", position: "RW", goals: 22, assists: 11, matches: 32, minutesPerGoal: 118 },
];

export const transfers: TransferItem[] = [
  { id: "t1", player: "Victor Osimhen", from: "Napoli", to: "Chelsea", fee: "EUR 110M", marketValue: "EUR 100M", type: "Rumor", timestamp: "15m ago" },
  { id: "t2", player: "Joao Neves", from: "Benfica", to: "Man United", fee: "EUR 70M", marketValue: "EUR 65M", type: "Confirmed", timestamp: "45m ago" },
  { id: "t3", player: "Nico Williams", from: "Athletic Club", to: "Barcelona", fee: "EUR 58M", marketValue: "EUR 55M", type: "Rumor", timestamp: "1h ago" },
];

