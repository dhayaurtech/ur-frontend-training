import InventorySummary from "@/src/components/products/InventorySummary";
import ProductList from "@/src/components/products/ProductList";
import { fetchProducts } from "@/src/services/productService";

type ProductsPageProps = {
  searchParams:Promise<{search?:string}>
}
export default async function Home({searchParams}:ProductsPageProps) {
  const {search=""} = await searchParams;
  const products = await fetchProducts()
  return (
    <main>
      {/* <InventorySummary products={products}/> */}
      <ProductList products={products} initialQuery={search}/>
    </main>
  );
}
