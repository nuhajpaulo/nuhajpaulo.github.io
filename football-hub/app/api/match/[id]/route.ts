import { NextRequest, NextResponse } from "next/server";
import { getMatchDetailsWithFallback } from "@/lib/rapidFootball";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = await getMatchDetailsWithFallback(id);

  if (!match) {
    return NextResponse.json({ message: "Match not found" }, { status: 404 });
  }

  return NextResponse.json(match);
}

