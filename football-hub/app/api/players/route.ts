import { NextResponse } from "next/server";
import { players } from "@/lib/mockData";
import { searchPlayersRaw } from "@/lib/rapidFootball";
import { Player } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  if (!search) {
    return NextResponse.json(players);
  }

  try {
    const payload = await searchPlayersRaw(search);
    const container =
      payload && typeof payload === "object"
        ? ((payload as Record<string, unknown>).response ??
            (payload as Record<string, unknown>).data ??
            payload)
        : payload;

    const list = Array.isArray(container)
      ? container.filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
      : [];

    const mapped: Player[] = list.slice(0, 20).map((item, index) => ({
      id: String(item.id ?? item.playerid ?? `rapid-player-${index + 1}`),
      name: String(item.name ?? item.player_name ?? "Unknown Player"),
      team: String(item.team ?? item.team_name ?? "Unknown Team"),
      nationality: String(item.nationality ?? item.country ?? "Unknown"),
      position: String(item.position ?? "N/A"),
      goals: Number(item.goals ?? 0),
      assists: Number(item.assists ?? 0),
      matches: Number(item.matches ?? item.appearances ?? 0),
      minutesPerGoal: Number(item.minutesPerGoal ?? 0),
    }));

    if (!mapped.length) {
      return NextResponse.json(players);
    }

    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json(players);
  }
}

