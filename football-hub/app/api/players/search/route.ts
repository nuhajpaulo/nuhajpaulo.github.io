import { NextResponse } from "next/server";
import { searchPlayersRaw } from "@/lib/rapidFootball";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "m";

  try {
    const payload = await searchPlayersRaw(search);
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json({ message: "Rapid search failed", error: String(error) }, { status: 502 });
  }
}
