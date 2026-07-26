"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-5 py-16">
      <div className="w-full text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-crimson/10">
          <svg className="h-8 w-8 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="mb-2 font-heading text-3xl font-extrabold tracking-tight">
          Something Went <span className="text-crimson">Wrong</span>
        </h1>
        <p className="mb-2 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          An unexpected error occurred. Please try again.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="mb-6 text-xs text-crimson font-mono bg-crimson/5 p-3 rounded text-left break-all">
            {error.message || "Unknown error"}
          </p>
        )}
        <button
          onClick={reset}
          className="btn-primary inline-flex hover:bg-transparent hover:text-crimson transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
