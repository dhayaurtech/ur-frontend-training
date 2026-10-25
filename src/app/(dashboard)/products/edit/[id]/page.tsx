import ProductForm from '@/components/products/ProductForm'
import { getCategories, getProducts } from '@/lib/services/products'
import { fetchProducts } from '@/services/productService'
import { cookies } from 'next/headers'

type EditProductPageProps = {
    params: Promise<{id:string}>
}
const EditProductPage = async({params}:EditProductPageProps) => {
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
    const {id} = await params;
  return (
    <>
    <ProductForm products={result.items} productId={id} mode="edit"/>
    </>
  )
}

export default EditProductPage