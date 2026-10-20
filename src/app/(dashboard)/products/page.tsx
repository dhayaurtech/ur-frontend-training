import type { Metadata } from "next";
import { fetchProducts } from "@/services/productService";
import ProductList from "@/components/products/ProductList";

export const metadata:Metadata = {
  title:'Products | ShopDesk',
  description:'Manage ShopDesk Products'
}

type ProductsPageProps = {
  searchParams:Promise<{
    search?:string,
    
  }>
}
const Products = async ({searchParams}:ProductsPageProps) => {
  const {search=""} = await searchParams;
  const fetchedProducts = await fetchProducts();
  return (
    <>
      <ProductList products={fetchedProducts} initialQuery={search} />
    </>
  );
};

export default Products;
