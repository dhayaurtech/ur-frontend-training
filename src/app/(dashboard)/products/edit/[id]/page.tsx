import ProductForm from '@/components/products/ProductForm'
import { fetchProducts } from '@/services/productService'

type EditProductPageProps = {
    params: Promise<{id:string}>
}
const EditProductPage = async({params}:EditProductPageProps) => {
    const products = await fetchProducts();
    const {id} = await params;
  return (
    <>
    <ProductForm products={products} productId={id} mode="edit"/>
    </>
  )
}

export default EditProductPage