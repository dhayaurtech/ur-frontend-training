"use client";

import type { Product, SortBy, SortDirection } from "@/src/types/product";
import ProductCard from "./ProductCard";
import {
  filterProductsByCategory,
  searchProducts,
  sortProducts,
} from "@/src/lib/products";

import CategoryFilter from "./CategoryFilter";
import SortSelect from "./SortSelect";
import { PackageSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SearchBar from "./SearchBar";

type ProductListProps = {
  products: Product[];
  initialQuery: string;
};

const ProductList = ({ products, initialQuery }: ProductListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState<string>(initialQuery);
  const [category, setCategory] = useState<string>("all");
  const [field, setField] = useState<SortBy>("name");
  const [direction, setDirection] = useState<SortDirection>("ascending");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const search = query.trim();

      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }

      if (category && category !== "all") {
        params.set("filter", category);
      } else {
        params.delete("filter");
      }

      const sort = `${field}-${direction}`;

      if (sort !== "name-ascending") {
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

  const filterResult = filterProductsByCategory(products, category);
  const sortResult = sortProducts(filterResult, field, direction);
  const searchResult = searchProducts(sortResult, query);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
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
            products={products}
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
            {searchResult.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">{products.length}</span>{" "}
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
    </div>
  );
};

export default ProductList;
