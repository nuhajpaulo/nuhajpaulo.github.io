import { NextResponse } from "next/server";
import { getLiveMatchesWithFallback } from "@/lib/rapidFootball";

export async function GET() {
  const matches = await getLiveMatchesWithFallback();
  return NextResponse.json(matches);
}
