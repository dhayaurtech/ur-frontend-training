"use client";

import { X, ChevronDown } from "lucide-react";
import type { Product, ProductCategory } from "@/types/product";
import Select from "../ui/Select";
import Option from "../ui/Option";

type CategoryType = {
  products: Product[];
  category: string;
  onCategoryChange: (value: string) => void;
};

const CategoryFilter = ({
  products,
  category,
  onCategoryChange,
}: CategoryType) => {
  const categories: ProductCategory[] = [
    "all",
    ...new Set(products.map((prod) => prod.category)),
  ];

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onCategoryChange(e.target.value as ProductCategory);
  }

  function handleClear() {
    onCategoryChange("all");
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <label
        htmlFor="category-filter"
        className="flex shrink-0 items-center gap-2 text-sm font-medium text-gray-600"
      >
        Category
      </label>

      <div className="relative min-w-0 flex-1 sm:flex-none">
        <Select
          id="category-filter"
          value={category}
          onChange={handleChange}
          className="min-w-36 capitalize"
        >
          {categories.map((cat) => (
            <Option key={cat} value={cat}>
              {cat === "all" ? "All categories" : cat}
            </Option>
          ))}
        </Select>

        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>

      {category !== "all" && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={`Clear ${category} category filter`}
          className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          <span className="capitalize">{category}</span>
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;
