
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
import Link from "next/link";
import { deleteProduct } from "@/lib/services/products";
import { useState } from "react";
import Button from "./ui/Button";

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
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectId, setSelectId] = useState<number | null>(null)
const summary = getInventorySummary(currentProducts);

const handleDelete = async() => {
  try {
    if(selectId!==null){
    await deleteProduct(selectId);

    setCurrentProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== selectId)
    );
    setShowModal(false);
    setSelectId(null);
    setShowToast(true);
  }
  } catch (error) {
    console.error("Failed to delete product : ",error);
  }
}

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
              className="border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>

                  <p className="mt-3 break-words text-2xl font-bold tracking-tight text-gray-900">
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
                <span>Current inventory overview</span>
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
      
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Product
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Category
                </th>
                <th scope="col" className="px-6 py-4 text-right font-semibold">
                  Price
                </th>
                <th scope="col" className="px-6 py-4 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {currentProducts.slice(0, 10).map((prod) => (
                <tr
                  key={prod.id}
                  className="transition-colors hover:bg-violet-50/40"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
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
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                      {prod.category}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right font-semibold tabular-nums text-gray-900">
                    {formatPrice(prod.price)}
                  </td>
                  <td className="flex gap-1 px-6 py-4 text-right font-semibold tabular-nums text-gray-900">
                    <Link href={`/products/edit/${prod.id}`}>
                    <Button variant="primary" size="sm">Edit</Button>
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => {setShowModal(true); setSelectId(prod.id);}}>Delete</Button>
                  </td>
                  
                </tr>
                
              ))}
              
              {products.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="rounded-full bg-gray-100 p-3 text-gray-400">
                        <Package size={24} />
                      </div>
                      <p className="font-medium text-gray-700">
                        No products yet
                      </p>
                      <p className="text-sm text-gray-500">
                        Your products will appear here when available.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {products.length > 20 && (
          <div className="border-t border-gray-100 px-6 py-3">
            <p className="text-xs text-gray-500">
              Showing the first 10 products out of {products.length}.
            </p>
          </div>
        )}
        
      </Card>
      {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-xl">
              <p className="text-lg font-semibold text-gray-900">
                Are you sure? 
              </p>
              <p className="text-center text-gray-600">
                Do you want to delete this product?
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={()=> setShowModal(false)}>Cancel</Button>
                <Button variant="danger" onClick={handleDelete}>Confirm</Button>
              </div>
            </div>
          </div>
        )}
        {showToast && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-xl">
              <p className="text-green-500">
                <CircleCheck className="w-15 h-15"/>
              </p>
              <p className="text-lg font-semibold text-gray-900">
                Product Deleted Successfully
              </p>
              <div className="flex gap-3">
                <Button variant="primary" onClick={()=> setShowToast(false)}>Ok</Button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default InventorySummary;
