"use client";

import type { ChangeEvent } from "react";
import { Search } from "lucide-react";
import Input from "../ui/Input";

type QueryType = {
  query: string;
  onQueryChange: (value: string) => void;
};

const SearchBar = ({ query, onQueryChange }: QueryType) => {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onQueryChange(e.target.value);
  }

  return (
    <div className="relative w-full gap-3">
      <Search
        size={18}
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <Input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search products..."
        aria-label="Search products"
        className="border-transparent bg-gray-100 pl-10 pr-4 hover:border-gray-200 focus:border-violet-500 focus:bg-white"
      />
    </div>
  );
};

export default SearchBar;
