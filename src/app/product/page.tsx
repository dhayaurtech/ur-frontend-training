import { getCategories, getProducts } from "@/lib/services/products";
import ProductList from "@/components/products/ProductList";
import Navbar from "@/components/Navbar";

type ProductsPageProps = {
  searchParams:Promise<{
    search?:string;
    category?:string;
    sort?:string;
    page?:string
  }>
}
const PublicProductPage = async ({searchParams}:ProductsPageProps) => {
  const params = await searchParams;

  const page = Math.max(1, Number(params.page) || 1);
  const category = params.category || "all";
  const search = params.search || "";
  const sort = params.sort || "title-ascending";
  const limit = 12;

  const [result,categories] = await Promise.all([
    getProducts({page,limit,search,category,sort}),
    getCategories()
  ])
  return (
    <>
    <Navbar isAuthenticated={true}/>
    <div className="min-h-screen bg-gray-50">
      <ProductList products={result.items} initialQuery={search} total={result.total} currentPage={result.page} limit={result.limit} initialCategory={category} initialSort={sort} categories={categories}/>
    </div>
    </>
  );
};

export default PublicProductPage;

