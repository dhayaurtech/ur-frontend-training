import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import { Image as ImageIcon, Package } from "lucide-react";
import Badge from "../ui/Badge";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const stockStatus = product.stock <=0 ? "out-of-stock" : product.stock <=5 ? "low-stock" : "in-stock";

  return (
    <Link href={`/products/${product.id}`}>
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md">
      {/* Product image */}
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gray-50 p-4">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 hover:rotate-3"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <ImageIcon size={40} strokeWidth={1.5} />
          </div>
        )}

        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold`}
        >
          <Badge status={stockStatus}/>
        </span>
      </div>

      {/* Product details */}
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-2 text-xs font-medium capitalize text-gray-500">
          {product.category}
        </p>

        <h2
          className="line-clamp-2 min-h-12 font-semibold leading-6 text-gray-900 transition-colors group-hover:text-violet-700"
          title={product.title}
        >
          {product.title}
        </h2>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-500">Price</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-gray-900">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Package size={16} />
            <span>{product.stock} units</span>
          </div>
        </div>
      </div>
    </article>
    </Link>
  );
};

export default ProductCard;

