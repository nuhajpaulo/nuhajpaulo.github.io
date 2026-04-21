import { NextResponse } from "next/server";
import { liveMatches, upcomingMatches } from "@/lib/mockData";
import { getPrediction } from "@/lib/prediction";

export async function GET() {
  const all = [...liveMatches, ...upcomingMatches].map((match) => ({
    matchId: match.id,
    ...getPrediction(match),
  }));

  return NextResponse.json(all);
}

