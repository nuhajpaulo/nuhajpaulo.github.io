import { NextResponse } from "next/server";
import { getLiveMatchesWithFallback } from "@/lib/rapidFootball";

export async function GET() {
  const live = await getLiveMatchesWithFallback();
  return NextResponse.json(live);
}

