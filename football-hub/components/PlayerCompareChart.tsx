"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface PlayerCompareChartProps {
  data: Array<{ stat: string; playerA: number; playerB: number }>;
}

export function PlayerCompareChart({ data }: PlayerCompareChartProps) {
  return (
    <div className="h-72 w-full rounded-2xl border border-white/10 bg-zinc-900/70 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
          <XAxis dataKey="stat" stroke="#a1a1aa" />
          <YAxis stroke="#a1a1aa" />
          <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #27272a" }} />
          <Bar dataKey="playerA" fill="#34d399" radius={4} />
          <Bar dataKey="playerB" fill="#38bdf8" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

