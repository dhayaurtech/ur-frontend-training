const Loading = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4">
      {/* Heading skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded bg-gray-200" />
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4 sm:flex-row">
        <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200" />
      </div>

      {/* Product cards skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-2xl border border-gray-200 p-5"
          >
            <div className="h-40 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
