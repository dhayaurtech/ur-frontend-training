import CartTable from '@/components/cart/CartTable';
import { getCartItems } from '@/lib/cart';


const CartPage = async () => {
  const cart = await getCartItems();

  if(!cart){
    return null;
  }

  return (
    <div>
      <CartTable cartItem={cart.cartItem} cartTotal={Number(cart?.cartTotal)}/>
    </div>
  );
};

export default CartPage;