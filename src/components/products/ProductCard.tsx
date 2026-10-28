import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import { Image as ImageIcon, Package, Star, StarHalf } from "lucide-react";
import Badge from "../ui/Badge";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const stockStatus = product.stock <=0 ? "out-of-stock" : product.stock <=5 ? "low-stock" : "in-stock";
  const rating = Math.floor(Number(product.rating))
  const remainingrating = Number(product.rating)-rating
  return (
    <Link href={`/products/${product.id}`}>
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border-4 border-violet-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md">
      {/* Product image */}
      <div className="relative flex h-48  items-center justify-center overflow-hidden ">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full  object-fill transition-transform duration-300 group-hover:scale-110"
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
      <div className="flex flex-1 flex-col p-4 bg-violet-50">
        <p className="mb-2 text-xs font-medium font-mono capitalize text-gray-500">
          {product.category}
        </p>

        <h2
          className="line-clamp-2 min-h-12 font-semibold font-mono leading-6 text-violet-900 transition-colors group-hover:text-violet-700"
          title={product.title}
        >
          {product.title}
        </h2>

        <div className="mt-auto flex items-end justify-between gap-2 border-gray-100">
          <div>
            <p className="text-sm flex text-violet-500">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span>{product.rating}</span>
            </p>
            <p className="text-xs text-gray-500 font-mono">Price</p>
            <p className="mt-1 text-md font-bold tabular-nums font-mono text-gray-900 flex items-center gap-2">
              {formatPrice(product.price)} <span className="text-xs text-green-600">{product.discountPercentage}% off</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Package size={16} className="text-violet-500" />
            <span className="text-violet-500 font-mono">{product.stock} units</span>
          </div>
        </div>
      </div>
    </article>
    </Link>
  );
};

export default ProductCard;

