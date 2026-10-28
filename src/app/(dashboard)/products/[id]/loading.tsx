
const Loading = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4">
      {/* Heading skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Product image and summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl bg-gray-200" />

        <div className="space-y-5 rounded-2xl border border-gray-200 p-6">
          <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
          <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
          <div className="h-12 w-40 animate-pulse rounded bg-gray-200" />

          <div className="grid grid-cols-2 gap-3">
            <div className="h-24 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-24 animate-pulse rounded-xl bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Description and specifications */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
        <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
      </div>

      {/* Reviews */}
      <div className="h-56 animate-pulse rounded-2xl bg-gray-200" />
    </div>
  );
};

export default Loading;
