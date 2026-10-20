import InventorySummary from "@/src/components/products/InventorySummary";
import ProductList from "@/src/components/products/ProductList";
import { fetchProducts } from "@/src/services/productService";
import { Package, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

type ProductsPageProps = {
  searchParams:Promise<{search?:string}>
}
export default async function Home({searchParams}:ProductsPageProps) {
  const {search=""} = await searchParams;
  const products = await fetchProducts()
  return (
    <main>
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-medium text-violet-600">
            Overview
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>

        <Link
          href="/products/new"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
        >
          <Plus size={18} />
          Add products
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Inventory section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-700">
            <Package size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Inventory overview
            </h2>
            <p className="text-sm text-gray-500">
              A quick look at your store&apos;s products.
            </p>
          </div>
        </div>
      </section>
      <InventorySummary products={products}/>
      <ProductList products={products} initialQuery={search}/>
      </div>
    </main>
  );
}
