"use client";

import { ArrowDownUp, ChevronDown } from "lucide-react";
import type { SortBy, SortDirection } from "@/src/types/product";
import Select from "../ui/Select";
import Option from "../ui/Option";

type SortType = {
  sortBy: SortBy;
  sortDirection: SortDirection;
  onSortByChange: (value: SortBy) => void;
  onSortDirectionChange: (value: SortDirection) => void;
};

const SortSelect = ({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}: SortType) => {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const [field, direction] = e.target.value.split("-");

    onSortByChange(field as SortBy);
    onSortDirectionChange(direction as SortDirection);
  }

  const OptionValues = [
    {
      optionVal:"name-ascending",
      text:"Name : A to Z"
    },
    {
      optionVal:"name-descending",
      text:"Name : Z to A"
    },
    {
      optionVal:"price-ascending",
      text:"Price : low to high"
    },
    {
      optionVal:"price-descending",
      text:"Price : high to low"
    },
    {
      optionVal:"createdat-ascending",
      text:"Oldest first"
    },
    {
      optionVal:"createdat-descending",
      text:"Newest first"
    },
  ]

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <label
        htmlFor="product-sort"
        className="flex shrink-0 items-center gap-2 text-sm font-medium text-gray-600"
      >
        <ArrowDownUp size={16} className="text-gray-400" />
        Sort by
      </label>

      <div className="relative min-w-0 flex-1 sm:flex-none">
        <Select
          id="product-sort"
          value={`${sortBy}-${sortDirection}`}
          onChange={handleChange}
          className="min-w-36"
        >
          {
            OptionValues.map((option) => {
              const optionValue = option.optionVal;
              const optionText = option.text;
              return(
              <Option key={optionValue} value={optionValue}>{optionText}</Option>
              )
            })
          }
        </Select>

        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
};

export default SortSelect;
