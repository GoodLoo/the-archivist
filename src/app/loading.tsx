export default function RootLoading() {
  return (
    <div className="mx-auto max-w-screen-2xl py-20">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 bg-dark-border/30 dark:bg-dark-border/30 bg-gray-200 rounded" />
        <div className="h-4 w-96 bg-dark-border/20 dark:bg-dark-border/20 bg-gray-100 rounded" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-dark-border/10 dark:bg-dark-border/10 bg-gray-50 rounded border border-dark-border dark:border-dark-border border-gray-200" />
          ))}
        </div>
        <div className="h-64 bg-dark-border/10 dark:bg-dark-border/10 bg-gray-50 rounded border border-dark-border dark:border-dark-border border-gray-200" />
      </div>
    </div>
  );
}
