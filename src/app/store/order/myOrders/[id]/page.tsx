import OrderDetails from '@/components/orders/OrderDetails'
import { getCurrentUser } from '@/lib/auth';
import { getOrderById } from '@/lib/order';

type OrderDetailsPageProps = {
    params:Promise<{id:string}>;
}
const OrderDetailsPage = async({params}:OrderDetailsPageProps) => {
    const {id} = await params;
    const order = await getOrderById(id)
    if(!order){
        return null;
    }

    const user = await getCurrentUser();
    if(!user) return null;
  return (
    <div>
      <OrderDetails order={order} user={user}/>
    </div>
  )
}

export default OrderDetailsPage
