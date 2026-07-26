interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-between mt-6 text-sm">
      <p className="text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 text-xs">
        Showing {(page - 1) * 8 + 1}&ndash;{Math.min(page * 8, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 text-xs font-medium border border-dark-border dark:border-dark-border border-gray-200 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600 hover:border-crimson hover:text-crimson transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">&hellip;</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                p === page
                  ? "border-crimson bg-crimson text-white"
                  : "border-dark-border dark:border-dark-border border-gray-200 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600 hover:border-crimson hover:text-crimson"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 text-xs font-medium border border-dark-border dark:border-dark-border border-gray-200 text-dark-text-secondary dark:text-dark-text-secondary text-gray-600 hover:border-crimson hover:text-crimson transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
