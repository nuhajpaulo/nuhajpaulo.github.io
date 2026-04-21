import { NextResponse } from "next/server";
import { getHomeLineupRaw } from "@/lib/rapidFootball";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const payload = await getHomeLineupRaw(id);
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json({ message: "Rapid lineup failed", error: String(error) }, { status: 502 });
  }
}
