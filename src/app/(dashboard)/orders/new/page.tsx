import OrderCreate from '@/components/orders/OrderCreate'
import { getAllAddress } from '@/lib/address'
import { getAllUsers } from '@/lib/auth'
import { getProducts } from '@/lib/services/products'

const OrderCreatePage = async () => {
  const [users, products, addresses] = await Promise.all([
    getAllUsers(),
    getProducts({ page: 1, limit: 10 }),
    getAllAddress(),
  ]);

  if (!users || !products || !addresses) return null;

  return (
    <OrderCreate
      users={users}
      products={products.items}
      addresses={addresses}
    />
  );
};

export default OrderCreatePage;
