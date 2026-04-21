export type League = string;

export interface Team {
  name: string;
  logo: string;
}

export interface Match {
  id: string;
  league: League;
  leagueId?: string;
  homeTeam: Team;
  awayTeam: Team;
  score: { home: number; away: number };
  minute: number;
  status: "LIVE" | "UPCOMING" | "FT";
  kickoff: string;
  stats: {
    possession: { home: number; away: number };
    shots: { home: number; away: number };
    shotsOnTarget: { home: number; away: number };
  };
  timeline: Array<{
    minute: number;
    team: "home" | "away";
    type: "goal" | "yellow" | "red";
    player: string;
  }>;
  form: {
    home: number[];
    away: number[];
  };
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
}

export interface Player {
  id: string;
  name: string;
  team: string;
  nationality: string;
  position: string;
  goals: number;
  assists: number;
  matches: number;
  minutesPerGoal: number;
}

export interface TransferItem {
  id: string;
  player: string;
  from: string;
  to: string;
  fee: string;
  marketValue: string;
  type: "Confirmed" | "Rumor";
  timestamp: string;
}

