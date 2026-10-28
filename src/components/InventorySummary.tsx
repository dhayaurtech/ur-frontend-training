
"use client";

import { getInventorySummary } from "@/lib/products";
import { formatPrice } from "@/lib/formatPrice";
import type { Product } from "@/types/product";
import Card from "./ui/Card";

import {
  Package,
  CircleCheck,
  PackageX,
  Wallet,
  ArrowUpRight,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";
import { Column } from "./ui/data-table/data-table.types";
import DataTable from "./ui/data-table/DataTable";

type InventorySummaryProps = {
  products: Product[];
};

const statsStyles = [
  {
    iconColor: "text-violet-700",
    iconBg: "bg-violet-100",
  },
  {
    iconColor: "text-emerald-700",
    iconBg: "bg-emerald-100",
  },
  {
    iconColor: "text-rose-700",
    iconBg: "bg-rose-100",
  },
  {
    iconColor: "text-blue-700",
    iconBg: "bg-blue-100",
  },
];

const InventorySummary = ({ products }: InventorySummaryProps) => {
  const [currentProducts, setCurrentProducts] = useState(products);
  const tableProducts = currentProducts.slice(0,10);
  const summary = getInventorySummary(currentProducts);

  const stats = [
    {
      label: "Total Products",
      value: summary.totalProducts,
      icon: Package,
    },
    {
      label: "Active Products",
      value: summary.activeProducts,
      icon: CircleCheck,
    },
    {
      label: "Out of Stock",
      value: summary.outOfStock,
      icon: PackageX,
    },
    {
      label: "Total Stock Value",
      value: formatPrice(summary.totalStockValue),
      icon: Wallet,
    },
  ];

  const productColumns:Column<Product>[] = [
    {
    header:"Product",
    accessor:"title",
    sortable:false,
    sort:() => "",
    sortDirection:null,
    selectable:false,
    cell:(prod) => (<div className="flex items-center gap-3">
                      {prod.thumbnail ? (
                        <img
                          src={prod.thumbnail}
                          alt={prod.title}
                          className="h-11 w-11 shrink-0 rounded-lg border border-gray-100 bg-gray-50 object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                          <ImageIcon size={20} />
                        </div>
                      )}

                      <span className="max-w-[220px] truncate font-medium text-gray-800">
                        {prod.title}
                      </span>
                    </div>)
  },
  {
    header:"Category",
    accessor:"category",
    sortable:false,
    sort:() => "",
    sortDirection:null,
    selectable:false,
    cell:(prod) => (<span className="inline-flex rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold font-mono text-violet-600">
                      {prod.category}
                    </span>)
  },
  {
    header:"Price",
    accessor:'price',
    sortable:false,
    sort:() => "",
    sortDirection:null,
    selectable:false,
    cell:(prod) => (<span className="text-right font-semibold tabular-nums text-gray-900">{formatPrice(prod.price)}</span>)
  }
 ]

  return (
    <div className="space-y-8">
      {/* Inventory statistics */}
      <section
        aria-label="Inventory statistics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const style = statsStyles[index];

          return (
            <Card
              key={stat.label}
              className="border border-gray-200 bg-linear-to-br from-violet-400 via-violet-950 to-purple-300  p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white font-mono uppercase">
                    {stat.label}
                  </p>

                  <p className="mt-3 wrap-break-word text-2xl font-bold tracking-tight text-white font-mono">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.iconBg} ${style.iconColor}`}
                >
                  <Icon size={21} strokeWidth={2} />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-xs text-gray-500">
                <ArrowUpRight size={15} className="text-violet-600" />
                <span className="text-white">Current inventory overview</span>
              </div>
            </Card>
          );
        })}
      </section>
      
      {/* Recent products */}
      <Card className="overflow-hidden border border-gray-200 bg-white p-0 shadow-sm">
        
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Products
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              A quick look at products in your inventory.
            </p>
          </div>

          <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            {products.length} products
          </span>
        </div>
      
        <div className="overflow-x-auto ">
          <DataTable rows={tableProducts} columns={productColumns}/>
        </div>

        {products.length > 20 && (
          <div className="border-t border-gray-100 px-6 py-3">
            <p className="text-xs text-gray-500">
              Showing the first 10 products out of {products.length}.
            </p>
          </div>
        )}
        
      </Card>
    </div>
  );
};

export default InventorySummary;
