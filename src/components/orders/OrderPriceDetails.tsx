import { formatPrice } from '@/lib/formatPrice'
import { OrderResponse } from '@/types/order'
import React from 'react'

type OrderPriceDetailsProps = {
    order:OrderResponse
}
const OrderPriceDetails = ({order}:OrderPriceDetailsProps) => {
  return (
    <>
    <div className="rounded-xl drop-shadow-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                    Price Details
                                </h2>
    
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between gap-3">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-medium text-gray-900">
                                            {formatPrice(order.subTotal)}
                                        </span>
                                    </div>
    
                                    <div className="flex justify-between gap-3">
                                        <span className="text-gray-500">Discount</span>
                                        <span className="font-medium text-green-600">
                                            - {formatPrice(order.discount)}
                                        </span>
                                    </div>
    
                                    <div className="flex justify-between gap-3">
                                        <span className="text-gray-500">Delivery Charge</span>
                                        <span className="font-medium text-red-600">
                                            + {formatPrice(order.deliveryCharge)}
                                        </span>
                                    </div>
    
                                    <div className="border-t border-dashed border-gray-200 pt-4">
                                        <div className="flex justify-between gap-3">
                                            <span className="text-lg font-semibold text-gray-900">
                                                Total Amount
                                            </span>
                                            <span className="text-lg font-semibold text-gray-900">
                                                {formatPrice(order.finalAmount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl drop-shadow-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                Payment Information
                            </h2>

                            <p className="text-sm text-gray-500">
                                Payment Method
                            </p>

                            <p className="mt-1 font-semibold text-gray-900">
                                {order.paymentMethod.replaceAll('_'," ")}
                            </p>
                        </div>
    </>
  )
}

export default OrderPriceDetails
