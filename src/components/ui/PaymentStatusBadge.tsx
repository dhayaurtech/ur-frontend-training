type PaymentBadgeStatus = "unpaid" | "paid";

type PaymentBadgeProps = {
  status: PaymentBadgeStatus;
  className?: string;
};

const statusStyles: Record<PaymentBadgeStatus, string> = {
  "paid": "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  "unpaid": "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
};

const statusLabels: Record<PaymentBadgeStatus, string> = {
  "unpaid": "Unpaid",
  "paid": "Paid",
};

export default function PaymentStatusBadge({
  status,
  className = "",
}: PaymentBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          status === "paid" ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
      {statusLabels[status]}
    </span>
  );
}

