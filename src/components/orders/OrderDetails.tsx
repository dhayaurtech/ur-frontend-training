"use client";
import { OrderResponse } from '@/types/order'
import OrderStatusDisplay from './OrderStatusDisplay'
import { formatPrice } from '@/lib/formatPrice'
import { ImageIcon } from 'lucide-react'
import { useState } from 'react'
import Button from '../ui/Button';
import { updateOrderStatus } from '@/lib/order-client';
import { useRouter } from 'next/navigation';
import OrderItemDetails from './OrderItemDetails';
import OrderShippingDetails from './OrderShippingDetails';
import OrderPriceDetails from './OrderPriceDetails';
import { AuthUser } from '@/lib/auth';

type OrderDetailsProps = {
    order: OrderResponse
    user:AuthUser
}

const OrderDetails = ({ order, user }: OrderDetailsProps) => {
    const router = useRouter();
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [isCancelling, setIsCancelling] = useState(false);
    
    const canCancel =
  order.orderStatus === "pending" ||
  order.orderStatus === "processing";

    const handleCancelOrder = async () => {
  if (!cancelReason.trim()) {
    return;
  }

  try {
    setIsCancelling(true);

    await updateOrderStatus(
      order._id,
      "cancelled",
      cancelReason
    );

    setShowCancelDialog(false);
    setCancelReason("");

    router.refresh();
  } catch (error) {
    console.error("Failed to cancel order:", error);
  } finally {
    setIsCancelling(false);
  }
};
    return (
        <div className="min-h-screen bg-violet-50 px-4 py-8 text-gray-800 sm:px-6 lg:px-10">

            <div className="mx-auto max-w-6xl">

                {/* Page Heading */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Order Details
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        View your order information, items and delivery details.
                    </p>
                </div>

                <div className="mb-6 flex flex-col gap-5 rounded-xl border border-gray-200 drop-shadow-2xl bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                        <div>
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="mt-1 break-all font-semibold text-gray-900">
                                {order._id}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Ordered On</p>
                                <p className="mt-1 font-medium text-gray-900">
                                    {new Date(order.orderDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Expected Delivery</p>
                                <p className="mt-1 font-medium text-green-700">
                                    {new Date(order.orderDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                                </p>
                            </div>
                        </div>

                    </div>
                    <OrderStatusDisplay order={order}/>
                    {canCancel && user.role!=="admin" && (<Button variant="danger" onClick={() => setShowCancelDialog(true)}>Cancel Order</Button>)}
                    {showCancelDialog && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <div className="w-full max-w-md rounded-lg bg-white p-6">
                                <h2 className="text-lg font-semibold">Cancel Order</h2>
                                <p className="mt-2 text-sm text-gray-600">Are you sure you want to cancel this order? This action cannot be undone.</p>
                                <label htmlFor="cancelReason" className="mt-4 block text-sm font-medium">Cancellation reason</label>
                                <textarea id="cancelReason" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Enter your reason..." className="mt-2 w-full rounded-md border p-3" required/>
                                <div className="mt-4 flex justify-end gap-3">
                                    <Button variant="secondary" onClick={() => setShowCancelDialog(false)} disabled={isCancelling}>
                                        Keep Order
                                    </Button>
                                    <Button variant="danger" onClick={handleCancelOrder} disabled={!cancelReason.trim() || isCancelling}>
                                        {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <OrderItemDetails order={order}/>
                        <OrderShippingDetails order={order}/>
                    </div>

                    <div className="space-y-6">
                        <OrderPriceDetails order={order}/>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default OrderDetails