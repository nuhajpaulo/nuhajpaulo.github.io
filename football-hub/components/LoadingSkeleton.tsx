export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-24 animate-pulse rounded-2xl bg-zinc-800" />
      ))}
    </div>
  );
}

