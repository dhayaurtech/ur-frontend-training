import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md border border-gray-200 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
          <SearchX size={32} className="text-violet-600" strokeWidth={1.8} />
        </div>

        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
          Error 404
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Page not found
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
          It may have been moved or no longer exists.
        </p>

        <div className="mt-7 flex justify-center">
          <Link href="/">
            <Button type="button" variant="primary" size="md">
              <Home size={16} />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;