import { formatPrice } from '@/lib/formatPrice'
import { OrderResponse } from '@/types/order'
import { ImageIcon } from 'lucide-react'
import React from 'react'

type OrderItemDetailsProps = {
    order:OrderResponse
}
const OrderItemDetails = ({order}:OrderItemDetailsProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white drop-shadow-2xl p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Items Details
                            </h2>

                            <div className="divide-y divide-gray-100">
                                {order.items.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="flex flex-col justify-between gap-3 py-5 first:pt-0 sm:flex-row sm:items-center"
                                    >
                                        <div>
                                            <div className='flex items-center gap-3'>
                                            {item.thumbnail ? <img src={item.thumbnail} alt={item.title} className="h-11 w-11 shrink-0 rounded-lg border border-gray-100 bg-gray-50 object-cover"/> : <ImageIcon/>}
                                            <h3 className="font-medium text-gray-900">
                                                {item.title}
                                            </h3>
                                            </div>
                                            <div>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Quantity: {item.quantity}
                                            </p>
                                            </div>
                                        </div>

                                        <p className="font-semibold text-gray-900">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
  )
}

export default OrderItemDetails
