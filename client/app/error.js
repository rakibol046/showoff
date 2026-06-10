"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
export default function GlobalError({ error, reset }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
          <div
            className={`max-w-2xl w-full transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Animated background blur effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-destructive/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "2s" }}
              />
            </div>

            {/* Main error card */}
            <div className="relative bg-card/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border">
              {/* Error icon */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-destructive to-destructive/80 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-12 h-12 text-destructive-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-ping" />
                </div>
              </div>

              {/* Error message */}
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Oops! Something went wrong
                </h1>
                <p className="text-lg text-muted-foreground mb-2">
                  We encountered an unexpected error while processing your
                  request.
                </p>
                <p className="text-sm text-muted-foreground">
                  Do not worry, our team has been notified and we are working on
                  it.
                </p>
              </div>

              {/* Error details */}
              {error?.message && (
                <div className="mb-8 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <p className="text-xs font-mono text-destructive break-all">
                    {error.message}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => reset()}
                  className="group relative px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Try Again
                  </span>
                </button>

                <Link
                  href="/"
                  className="px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-xl border hover:bg-secondary/80 transition-all duration-300 hover:scale-105 text-center"
                >
                  Go Home
                </Link>
              </div>

              {/* Help text */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Need help?{" "}
                  <Link
                    href="/contacts"
                    target="_blank"
                    className="text-primary hover:underline transition-colors"
                  >
                    Contact our support team
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
