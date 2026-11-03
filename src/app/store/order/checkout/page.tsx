import CheckoutPage from '@/components/orders/CheckoutPage'
import { getAddress } from '@/lib/address'
import { getCartItems } from '@/lib/cart';

const page = async () => {
  const currentAddress = await getAddress();

  if(!currentAddress){
    return null;
  }

  const cart = await getCartItems();
  if(!cart){
    return null;
  }

  return (
    <div>
      <CheckoutPage address={currentAddress} cartItems={cart.cartItem} buyNow={false}/>
    </div>
  )
}

export default page
