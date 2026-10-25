"use client";

import type { Product, SortBy, SortDirection } from "@/types/product";
import ProductCard from "./ProductCard";
import CategoryFilter from "./CategoryFilter";
import SortSelect from "./SortSelect";
import { PackageSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SearchBar from "../SearchBar";

type ProductListProps = {
  products: Product[];
  initialQuery: string;
  total:number;
  currentPage:number;
  limit:number;
  initialCategory:string;
  initialSort:string;
  categories:string[];
};

const ProductList = ({ products, initialQuery, total, currentPage, limit, initialCategory, initialSort,categories }: ProductListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState<string>(initialQuery);
  const [category, setCategory] = useState<string>(initialCategory);
  const [field, setField] = useState<SortBy>(() => {
    const [sortField] = initialSort.split('-');
    if(sortField === "price") return "price";
    if(sortField === "createdat") return "createdat";
    return "title";
  });
  const [direction, setDirection] = useState<SortDirection>(() => {
    const [,sortDirection] = initialSort.split('-');
    return sortDirection === "descending" ? "descending" : "ascending";
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const currentSearch = params.get("search") ?? "";
      const currentCategory = params.get("category") ?? "all";
      const currentSort = params.get("sort") ?? "title-ascending";

      const nextSearch = query.trim();
      const nextCategory = category || "all";
      const nextSort = `${field}-${direction}`;

      const filtersChanged = currentSearch !== nextSearch || currentCategory !== nextCategory || currentSort !== nextSort;

      if(filtersChanged){
        params.delete("page")
      }
      const search = query.trim();

      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }

      if (category && category !== "all") {
        params.set("category", category);
      } else {
        params.delete("category");
      }

      const sortField = field === "createdat" ? "createdat" : field;
      const sort = `${sortField}-${direction}`

      if (sort !== "title-ascending") {
        params.set("sort", sort);
      } else {
        params.delete("sort");
      }
       
      const queryString = params.toString();
      const newURL = queryString ? `${pathname}?${queryString}` : pathname;

      const currentURL = `${pathname}${searchParams.size ? `?${searchParams.toString()}` : ""}`;

      if (newURL !== currentURL) {
        router.replace(newURL, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, category, field, direction, pathname, router, searchParams]);

 const searchResult = products;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3">
      {/* Page heading */}
      <section>
        <p className="mb-2 text-sm font-medium text-violet-600">Inventory</p>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Products
        </h1>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Manage your products, categories, and pricing.
        </p>
      </section>

      {/* Search, Filters and sorting */}
      <section
        aria-label="Product filters"
        className="flex flex-col items-center justify-around rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0 flex-1">
          <SearchBar query={query} onQueryChange={setQuery} />
        </div>
        <div className="min-w-0 flex-1">
          <CategoryFilter
            categories={categories}
            category={category}
            onCategoryChange={setCategory}
          />
        </div>

        <div className="min-w-0 flex-1">
          <SortSelect
            sortBy={field}
            sortDirection={direction}
            onSortByChange={setField}
            onSortDirectionChange={setDirection}
          />
        </div>
      </section>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {total === 0 ? 0 : (currentPage-1)*limit+1}
          </span>{" "}
          <span className="font-semibold text-gray-900">
            {Math.min(currentPage*limit,total)}
          </span>
          of{" "}
          <span className="font-semibold text-gray-900">{total}</span>{" "}
          products
        </p>
      </div>

      {/* Product grid or empty state */}
      {searchResult.length > 0 ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {searchResult.map((prod) => (
            <li key={prod.id} className="min-w-0">
              <ProductCard product={prod} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <div className="mb-4 rounded-2xl bg-violet-50 p-4 text-violet-600">
            <PackageSearch size={28} />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            No products found
          </h2>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Try changing your search term or selecting a different category.
          </p>
        </div>
      )}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
  <button
    type="button"
    disabled={currentPage <= 1}
    onClick={() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(currentPage - 1));
      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }}
    className="rounded-lg border-3 border-violet-500 text-violet-500 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
  >
    Previous
  </button>

  <p className="text-sm text-gray-500">
    Page {currentPage} of {Math.max(1, Math.ceil(total / limit))}
  </p>

  <button
    type="button"
    disabled={currentPage * limit >= total}
    onClick={() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(currentPage + 1));
      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }}
    className="rounded-lg border-2 border-violet-500 text-violet-500 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
  >
    Next
  </button>
</div>
    </div>
  );
};

export default ProductList;
