import { NextResponse } from "next/server";
import { getMatchesByDateAndLeagueRaw } from "@/lib/rapidFootball";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? undefined;
  const leagueId = searchParams.get("leagueid") ?? undefined;

  try {
    const data = await getMatchesByDateAndLeagueRaw(date, leagueId);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Rapid matches by date+league failed", error: String(error) },
      { status: 502 }
    );
  }
}
