import {
  Check,
  Circle,
  PackageCheck,
  Truck,
} from 'lucide-react';
import { OrderResponse, OrderStatus } from '@/types/order';

type OrderStatusDisplayProps = {
    order:OrderResponse
}

const OrderStatusDisplay = ({order}:OrderStatusDisplayProps) => {
    const statusSteps: { label: string; value: OrderStatus }[] = [
  { label: 'Placed', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Out for Delivery', value: 'out_for_delivery' },
  { label: 'Delivered', value: 'delivered' },
];

const statusIndex = statusSteps.findIndex(
  (step) => step.value === order.orderStatus,
);
  return (

<div className="rounded-2xl border border-violet-100 bg-violet-300/50 p-5 sm:p-6">
  <div className="flex items-start">
    {statusSteps.map((step, index) => {
      const completed = index <= statusIndex;
      const current = index === statusIndex;

      return (
        <div key={step.value} className="relative flex flex-1 flex-col items-center">
          {index !== 0 && (
            <div
              className={`absolute right-1/2 top-5 h-1 w-full ${
                index <= statusIndex
                  ? 'bg-violet-600'
                  : 'bg-gray-200'
              }`}
            />
          )}

          <div
            className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${
              completed
                ? 'bg-violet-600 text-white'
                : 'border-2 border-gray-200 bg-white text-gray-400'
            } ${current ? 'ring-4 ring-violet-100' : ''}`}
          >
            {completed ? (
              index === statusIndex ? (
                <PackageCheck size={20} />
              ) : (
                <Check size={20} />
              )
            ) : index === statusSteps.length - 1 ? (
              <Truck size={18} />
            ) : (
              <Circle size={16} />
            )}
          </div>

          {/* Label */}
          <p
            className={`mt-3 text-center text-xs font-medium sm:text-sm ${
              current
                ? 'text-violet-700'
                : completed
                  ? 'text-gray-700'
                  : 'text-gray-400'
            }`}
          >
            {step.label}
          </p>
        </div>
      );
    })}
  </div>

  <p className="mt-5 text-center text-sm font-medium text-violet-700">
    {order.orderStatus === 'delivered'
      ? 'Your order has been delivered!'
      : `Current status: ${order.orderStatus.replaceAll('_', ' ')}`}
  </p>
</div>
  )
}

export default OrderStatusDisplay
