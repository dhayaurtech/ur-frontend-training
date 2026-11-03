import React from 'react'
import { OrderResponse } from '@/types/order'

type OrderShippingDetailsProps = {
    order: OrderResponse
}
const OrderShippingDetails = ({order}:OrderShippingDetailsProps) => {
  return (
    <div className="rounded-xl drop-shadow-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                Shipping Address
                            </h2>

        <div className="text-sm leading-relaxed text-gray-600">
            <p className="font-bold text-gray-900">{order.customerName}</p>
                <p className="font-normal text-gray-900">
                    {order.addressDetails.address},
                </p>
                <p>{order.addressDetails.street},</p>
                <p>{order.addressDetails.city}</p>
                <p>PIN: {order.addressDetails.pincode}</p>
        </div>
    </div>
  )
}

export default OrderShippingDetails
