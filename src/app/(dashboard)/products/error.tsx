"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const Error = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    console.error("Products route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md border border-gray-200 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle
            size={32}
            strokeWidth={1.8}
            className="text-red-600"
          />
        </div>

        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
          Products
        </p>

        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Something went wrong
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          We couldn&apos;t load this page. Please try again.
        </p>

        {error.digest && (
          <p className="mt-3 text-xs text-gray-400">
            Error reference: {error.digest}
          </p>
        )}

        <div className="mt-7 flex justify-center">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={16} />
            Try again
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Error;
