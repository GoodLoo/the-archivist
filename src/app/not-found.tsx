import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-5 py-16">
      <div className="w-full text-center">
        <div className="mb-6 font-heading text-8xl font-black tracking-tight text-crimson">404</div>
        <h1 className="mb-2 font-heading text-3xl font-extrabold tracking-tight">
          Page Not <span className="text-crimson">Found</span>
        </h1>
        <p className="mb-8 text-sm text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="btn-primary inline-flex hover:bg-transparent hover:text-crimson transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
