interface LeagueFilterProps {
  value: string;
  onChange: (league: string) => void;
  options?: string[];
}

export function LeagueFilter({ value, onChange, options = [] }: LeagueFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => onChange("All")} className={`rounded-full px-4 py-2 text-sm ${value === "All" ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-300"}`}>
        All
      </button>
      {options.map((league) => (
        <button key={league} onClick={() => onChange(league)} className={`rounded-full px-4 py-2 text-sm ${value === league ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-300"}`}>
          {league}
        </button>
      ))}
    </div>
  );
}

