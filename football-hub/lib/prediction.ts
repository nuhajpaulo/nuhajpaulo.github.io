import { Match } from "@/lib/types";

export function getPrediction(match: Match) {
  const sum = (arr: number[]) => arr.reduce((acc, val) => acc + val, 0);
  const homeForm = sum(match.form.home);
  const awayForm = sum(match.form.away);

  const homeStrength = homeForm + (match.stats.shots.home - match.stats.shots.away) * 0.2;
  const awayStrength = awayForm + (match.stats.shots.away - match.stats.shots.home) * 0.2;

  const total = Math.max(1, homeStrength + awayStrength);
  const homeProbability = Math.round((homeStrength / total) * 100);

  if (homeProbability >= 55) {
    return { winner: match.homeTeam.name, probability: `${homeProbability}% Home Win` };
  }

  if (homeProbability <= 45) {
    return { winner: match.awayTeam.name, probability: `${100 - homeProbability}% Away Win` };
  }

  return { winner: "Draw", probability: "Even match - draw likely" };
}

