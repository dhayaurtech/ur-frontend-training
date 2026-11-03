import CheckoutPage from '@/components/orders/CheckoutPage';
import { getAddress } from '@/lib/address';
import { getProduct } from '@/lib/services/products';

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  const currentAddress = await getAddress();
  const product = await getProduct(id);

  if (!currentAddress || !product) {
    return null;
  }

  const cartItems = [
    {
      product,
      quantity: 1,
    },
  ];

  return (
    <CheckoutPage address={currentAddress} cartItems={cartItems} buyNow={true}/>
  );
};

export default Page;