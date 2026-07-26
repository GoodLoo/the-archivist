export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white overflow-x-auto animate-pulse">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dark-border/50">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="p-3"><div className="h-3 w-20 bg-dark-border/30 dark:bg-dark-border/30 bg-gray-200 rounded" /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-b border-dark-border/30">
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="p-3"><div className="h-4 w-full bg-dark-border/20 dark:bg-dark-border/20 bg-gray-100 rounded" style={{ maxWidth: `${60 + Math.random() * 40}%` }} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5 animate-pulse">
      <div className="h-3 w-24 bg-dark-border/30 dark:bg-dark-border/30 bg-gray-200 rounded mb-3" />
      <div className="h-8 w-16 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-100 rounded mb-2" />
      <div className="h-3 w-32 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-100 rounded" />
    </div>
  );
}

export function StatsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5 animate-pulse">
      <div className="h-3 w-32 bg-dark-border/30 dark:bg-dark-border/30 bg-gray-200 rounded mb-4" />
      <div className="flex items-end gap-2 h-40">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex-1 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-100 rounded" style={{ height: `${20 + Math.random() * 80}%` }} />
        ))}
      </div>
    </div>
  );
}
