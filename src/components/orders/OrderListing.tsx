import { OrderResponse } from '@/types/order'
import Link from 'next/link'
import React from 'react'
import Button from '../ui/Button'
import { formatPrice } from '@/lib/formatPrice'

type OrderListingProps = {
    order:OrderResponse
}

const OrderListing = ({order}:OrderListingProps) => {
  return (
    <li key={order._id} className='w-full p-4 border-2 border-violet-200 drop-shadow-lg  rounded-2xl bg-linear-to-r from-violet-400 to-violet-100 text-violet-900'>
            <div className='flex items-center justify-between gap-10'>
                <div className='flex items-center justify-between w-full'>
                <div>
                    {order.items.map((item) => (
                        <li key={item.productId}>{item.title} ({formatPrice(item.price)})</li>
                    ))}
                </div>
                <div>
                    <p className='font-bold'>Delivery Date</p>
                    <p>{new Date(order.deliveryDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</p>
                </div>
                </div>
                <div>
                   <Link href={`/store/order/myOrders/${order._id}`}><Button>view order</Button></Link>
                </div>
        </div>
    </li>
  )
}

export default OrderListing
