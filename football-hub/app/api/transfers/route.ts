import { NextResponse } from "next/server";
import { transfers } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(transfers);
}

