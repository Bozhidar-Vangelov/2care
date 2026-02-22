"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Global error boundary — catches errors thrown inside the root layout itself
 * (e.g. a crash in Providers, ThemeProvider, etc.).
 *
 * Next.js rules:
 *  - Must be a Client Component
 *  - Must render its own <html> and <body> tags (root layout is bypassed)
 *  - Lives at the app root, NOT inside a route group
 */
interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-svh flex flex-col items-center justify-center gap-6 p-6 text-center font-sans antialiased">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-widest text-red-500">
            Critical error
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
          <p className="max-w-sm text-sm text-gray-500">
            The application encountered an unrecoverable error.
            {error.digest && (
              <span className="block mt-1 font-mono text-xs">ID: {error.digest}</span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Reload app
          </Button>
        </div>
      </body>
    </html>
  );
}
