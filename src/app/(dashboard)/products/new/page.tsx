import ProductForm from '@/components/products/ProductForm';
import { fetchProducts } from '@/services/productService'


const AddProductPage = async() => {
    const products = await fetchProducts();
  return (
    <ProductForm products={products} mode="add"/>
  )
}

export default AddProductPage