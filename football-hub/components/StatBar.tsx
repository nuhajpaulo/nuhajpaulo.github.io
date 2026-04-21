import clsx from "clsx";

interface StatBarProps {
  label: string;
  home: number;
  away: number;
}

export function StatBar({ label, home, away }: StatBarProps) {
  const total = Math.max(1, home + away);
  const homePercent = Math.round((home / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-zinc-300">
        <span>{home}</span>
        <span className="font-medium text-zinc-100">{label}</span>
        <span>{away}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <div className={clsx("h-full rounded-full", homePercent >= 50 ? "bg-emerald-400" : "bg-sky-400")} style={{ width: `${homePercent}%` }} />
      </div>
    </div>
  );
}

