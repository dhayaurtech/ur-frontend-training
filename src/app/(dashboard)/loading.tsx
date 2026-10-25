
const Loading = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4">
      {/* Welcome heading skeleton */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="w-full space-y-3">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded bg-gray-200" />
        </div>

        {/* Add product button placeholder */}
        <div className="h-11 w-40 animate-pulse rounded-xl bg-gray-200" />
      </section>

      {/* Inventory heading skeleton */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-64 max-w-full animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Inventory summary card placeholders */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
              <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Loading;
