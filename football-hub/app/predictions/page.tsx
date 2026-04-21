"use client";

import { useEffect, useState } from "react";
import { footballApi } from "@/lib/api";

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Array<{ matchId: string; winner: string; probability: string }>>([]);

  useEffect(() => {
    footballApi.predictions().then(setPredictions);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Match Predictions</h1>
      <div className="grid gap-3">
        {predictions.map((item) => (
          <div key={item.matchId} className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
            <h2 className="font-semibold">Match: {item.matchId}</h2>
            <p className="text-zinc-300">Predicted Winner: {item.winner}</p>
            <p className="text-sm text-zinc-400">{item.probability}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

