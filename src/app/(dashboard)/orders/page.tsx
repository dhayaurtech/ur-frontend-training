import OrderTable from '@/components/orders/OrderTable'
import { getAllOrders } from '@/lib/order-client'
import { cookies } from 'next/headers'
import React from 'react'

type OrdersPageProps = {
  searchParams:Promise<{
    search?:string;
    status?:string;
    dateRange?:string;
    sort?:string;
    page?:string;
    limit?:string;
  }>
}
const OrdersPage = async({searchParams}:OrdersPageProps) => {
    const params = await searchParams;
    
      const cookieStore = await cookies();
      const token = cookieStore.get("accessToken")?.value;
    
      const requestOptions: RequestInit = token
        ? {
          headers: {
            cookie: `accessToken=${token}`,
          },
        }
        : {};
    const search = params.search || ""
    const status = params.status || ""
    const dateRange = params.dateRange || "";
    const sort = params.sort || "orderDate-ascending"
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100,Math.max(1,Number(params.limit) || 10));
    const result = await getAllOrders({search,status,dateRange,sort,page,limit},requestOptions)
  return (
    <div className="min-h-screen">
      <OrderTable orders={result.orders} search={search} status={status} dateRange={dateRange} sort={sort} total={result.total} page={result.page} limit={result.limit}/>
    </div>
  )
}

export default OrdersPage