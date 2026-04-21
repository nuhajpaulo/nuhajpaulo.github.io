"use client";

import { useEffect, useState } from "react";
import { footballApi } from "@/lib/api";
import { TransferItem } from "@/lib/types";

export default function TransfersPage() {
  const [items, setItems] = useState<TransferItem[]>([]);

  useEffect(() => {
    footballApi.transfers().then(setItems);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transfer Radar</h1>
      <div className="max-h-[500px] space-y-3 overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-white/10 bg-zinc-900/70 p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{item.player}</h2>
              <span className={`rounded-full px-2 py-1 text-xs ${item.type === "Confirmed" ? "bg-emerald-500 text-black" : "bg-amber-500 text-black"}`}>{item.type}</span>
            </div>
            <p className="mt-1 text-sm text-zinc-300">{item.from} ? {item.to}</p>
            <p className="text-sm text-zinc-400">Fee: {item.fee} · Market Value: {item.marketValue}</p>
            <p className="mt-1 text-xs text-zinc-500">{item.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

