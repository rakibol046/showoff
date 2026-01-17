import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16 text-center dark:bg-neutral-950">
      {/* Illustration */}
      <div className="mb-8 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          className="h-32 w-32 text-neutral-400 dark:text-neutral-600"
          aria-hidden="true"
        >
          {/* Cart outline */}
          <path
            d="M12 52h40M8 52h48l-4-28H12l-4 28Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          {/* Eyes */}
          <circle
            cx="24"
            cy="20"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="40"
            cy="20"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          {/* Wavy mouth */}
          <path
            d="M24 20c0 6 16 6 16 0"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          ></path>
        </svg>
      </div>

      {/* Text */}
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-neutral-600 dark:text-neutral-400">
        Sorry, we couldn’t find the page you’re looking for. Explore our latest
        collection and get back to shopping.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Back to Home
        </Link>
        <Link
          href="/products"
          className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Browse Clothing
        </Link>
      </div>
    </div>
  );
}
