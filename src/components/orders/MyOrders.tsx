import { OrderResponse } from '@/types/order'
import Button from '../ui/Button';
import { formatPrice } from '@/lib/formatPrice';
import Link from 'next/link';
import OrderListing from './OrderListing';
import { PackageSearch } from 'lucide-react';


type MyOrdersPageProps = {
    orders:OrderResponse[];
}
const MyOrders = ({orders}:MyOrdersPageProps) => {
  return (
    <div className='mx-auto  max-w-screen h-full px-25 bg-violet-50'>
    <section>

        <h1 className="text-2xl font-bold tracking-tight text-violet-900 sm:text-3xl">
          Orders
        </h1>

        <p className="mt-2 text-sm text-violet-500 sm:text-base">
          Manage your orders.
        </p>
      </section>
    {orders.length > 0 ? (
    <ul className='flex flex-col gap-5 p-3'>
      {orders.map((order) => (
        <OrderListing order={order}/>
      )).reverse()}
    </ul>
    ) : (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <div className="mb-4 rounded-2xl bg-violet-50 p-4 text-violet-600">
            <PackageSearch size={28} />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            No Orders found
          </h2>
        </div>
    )}
    </div>
  )
}

export default MyOrders
