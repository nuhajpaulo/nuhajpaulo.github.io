import { NextResponse } from "next/server";
import { getMatchesByLeagueWithFallback } from "@/lib/rapidFootball";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const leagueid = searchParams.get("leagueid") ?? undefined;

  const data = await getMatchesByLeagueWithFallback(leagueid);
  return NextResponse.json(data);
}
