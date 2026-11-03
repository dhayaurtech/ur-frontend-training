import MyOrders from '@/components/orders/MyOrders'
import { getOrders } from '@/lib/order'

const OrdersPage = async () => {
    const orders = await getOrders();

    if(!orders){
        return null;
    }

  return (
    <div>
      <MyOrders orders={orders}/>
    </div>
  )
}

export default OrdersPage
