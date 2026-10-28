import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getCategories, getProducts } from "@/lib/services/products";
import ProductTable from "@/components/products/ProductTable";

export const metadata:Metadata = {
  title:'Products | ShopDesk',
  description:'Manage ShopDesk Products'
}

type ProductsPageProps = {
  searchParams:Promise<{
    search?:string;
    category?:string;
    sort?:string;
    page?:string;
    limit?:string;
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
  const limit = Math.min(100,Math.max(1,Number(params.limit) || 10));

  const [result] = await Promise.all([
    getProducts({page,limit},requestOptions),
    getCategories(requestOptions)
  ])

  return (
    <>
    <div className="min-h-screen">
      <ProductTable products={result.items} total={result.total} page={result.page} limit={result.limit} sort={sort}/>
    </div>
    </>
  );
};

export default Products;
