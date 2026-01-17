"use client";
import { Shirt } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-6">
          {/* Animated loader */}
          <div className="relative flex items-center justify-center">
            {/* Outer pulse ring */}
            <div className="absolute h-24 w-24 animate-ping rounded-full bg-primary/20" />

            {/* Middle rotating ring */}
            <div className="absolute h-20 w-20 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />

            {/* Inner icon container */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl">
              <Shirt className="h-7 w-7 animate-pulse" />
            </div>
          </div>

          {/* Loading text with animated dots */}
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-lg font-medium">Loading latest styles </span>
            <span className="flex gap-1">
              <span
                className="animate-bounce"
                style={{ animationDelay: "0ms" }}
              >
                .
              </span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "150ms" }}
              >
                .
              </span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "300ms" }}
              >
                .
              </span>
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
