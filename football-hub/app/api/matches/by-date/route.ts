import { NextResponse } from "next/server";
import { getMatchesByDateWithFallback } from "@/lib/rapidFootball";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? undefined;

  const data = await getMatchesByDateWithFallback(date);
  return NextResponse.json(data);
}
