import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getCategories, getProducts } from "@/lib/services/products";
import ProductList from "@/components/products/ProductList";
import Navbar from "@/components/Navbar";

export const metadata:Metadata = {
  title:'Products | ShopDesk',
  description:'Manage ShopDesk Products'
}

type ProductsPageProps = {
  searchParams:Promise<{
    search?:string;
    category?:string;
    sort?:string;
    page?:string
  }>
}
const Products = async ({searchParams}:ProductsPageProps) => {
  const params = await searchParams;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const requestOptions: RequestInit = token
    ? {
      headers: {
        cookie: `accessToken=${token}`,
      },
    }
    : {};

  const page = Math.max(1, Number(params.page) || 1);
  const category = params.category || "all";
  const search = params.search || "";
  const sort = params.sort || "title-ascending";
  const limit = 10;

  const [result,categories] = await Promise.all([
    getProducts({page,limit,search,category,sort},requestOptions),
    getCategories(requestOptions)
  ])

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <ProductList products={result.items} initialQuery={search} total={result.total} currentPage={result.page} limit={result.limit} initialCategory={category} initialSort={sort} categories={categories}/>
    </div>
    </>
  );
};

export default Products;
