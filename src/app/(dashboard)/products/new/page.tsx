import ProductForm from '@/components/products/ProductForm';
import { getProducts } from '@/lib/services/products';
import { cookies } from 'next/headers';

const AddProductPage = async() => {
    const cookieStore = await cookies();
      const token = cookieStore.get("accessToken")?.value;
    
      const requestOptions: RequestInit = token
        ? {
          headers: {
            cookie: `accessToken=${token}`,
          },
        }
        : {};
    const result = await getProducts({},requestOptions)
  return (
    <ProductForm products={result.items} mode="add"/>
  )
}

export default AddProductPage