import { NextResponse } from "next/server";
import { news } from "@/lib/mockData";
import { getTrendingNewsRaw } from "@/lib/rapidFootball";
import { NewsItem } from "@/lib/types";

export async function GET() {
  try {
    const payload = await getTrendingNewsRaw();
    const container =
      payload && typeof payload === "object"
        ? ((payload as Record<string, unknown>).response ??
            (payload as Record<string, unknown>).data ??
            payload)
        : payload;

    const list = Array.isArray(container)
      ? container.filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
      : [];

    if (!list.length) {
      return NextResponse.json(news);
    }

    const mapped: NewsItem[] = list.slice(0, 10).map((item, index) => ({
      id: String(item.id ?? `rapid-news-${index + 1}`),
      title: String(item.title ?? item.headline ?? "Trending football update"),
      source: String(item.source ?? item.publisher ?? "RapidAPI"),
      timeAgo: String(item.timeAgo ?? item.pubDate ?? "Now"),
    }));

    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json(news);
  }
}

