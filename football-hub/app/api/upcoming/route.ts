import { NextResponse } from "next/server";
import { getUpcomingMatchesWithFallback } from "@/lib/rapidFootball";

export async function GET() {
  const upcoming = await getUpcomingMatchesWithFallback();
  return NextResponse.json(upcoming);
}

