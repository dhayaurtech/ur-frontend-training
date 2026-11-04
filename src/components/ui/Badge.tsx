type BadgeStatus = "in-stock" | "low-stock" | "out-of-stock";

type BadgeProps = {
  status: BadgeStatus;
  className?: string;
};

const statusStyles: Record<BadgeStatus, string> = {
  "in-stock": "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  "low-stock": "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  "out-of-stock": "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
};

const statusLabels: Record<BadgeStatus, string> = {
  "in-stock": "In Stock",
  "low-stock": "Low Stock",
  "out-of-stock": "Out of Stock",
};

export default function Badge({
  status,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          status === "in-stock"
            ? "bg-emerald-500"
            : status === "low-stock"
              ? "bg-amber-500"
              : "bg-rose-500"
        }`}
      />
      {statusLabels[status]}
    </span>
  );
}

