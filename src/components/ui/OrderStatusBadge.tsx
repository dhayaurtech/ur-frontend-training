type OrderBadgeStatus = "pending" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";

type OrderBadgeProps = {
  status: OrderBadgeStatus;
  className?: string;
};

const statusStyles: Record<OrderBadgeStatus, string> = {
  "pending": "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  "processing": "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  "shipped": "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  "out_for_delivery":"bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  "delivered": "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  "cancelled":"bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20"
};

const statusLabels: Record<OrderBadgeStatus, string> = {
  "pending": "Pending",
  "processing": "Processing",
  "shipped":"Shipped",
  "out_for_delivery":"Out for delivery",
  "delivered":"Delivered",
  "cancelled":"Cancelled"
};

export default function OrderStatusBadge({
  status,
  className = "",
}: OrderBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          (status === "pending" || status === "processing") ? "bg-amber-500" : (status === "cancelled") ? "bg-rose-500" : "bg-emerald-500"
        }`}
      />
      {statusLabels[status]}
    </span>
  );
}

