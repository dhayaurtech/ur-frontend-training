import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Star,
  Tag,
  Weight,
  Ruler,
  MessageSquare,
} from "lucide-react";

import { getProduct, getProducts } from "@/lib/services/products";
import { formatPrice } from "@/lib/formatPrice";
import Badge from "@/components/ui/Badge";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import { ApiError } from "@/lib/api-client";


type ProductDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({params}:ProductDetailsPageProps):Promise<Metadata>{
    const {id} = await params;
    const productId = Number(id);

    if(!Number.isInteger(productId) || productId<=0){
      return {
        title:"Product Not Found | ShopDesk" 
      }
    }

    try {
      const product = await getProduct(productId);
      return {
        title:`${product.title} | ShopDesk`,
        description:product.description
      }
    } catch (error) {
      return{
        title:'Product Not Found | ShopDesk'
      }
    }
}

const ProductDetailsPage = async ({
  params,
}: ProductDetailsPageProps) => {
  const { id } = await params;
  const productId = Number(id);

  if(!Number.isInteger(productId) || productId<=0){
    notFound();
  }

  let product;

  try {
    product = await getProduct(productId);
  } catch (error) {
    if(error instanceof ApiError && error.status === 404){
      notFound();
    }
    throw error;
  }

  const stockStatus =
    product.stock <= 0
      ? "out-of-stock"
      : product.stock <= 5
        ? "low-stock"
        : "in-stock";

  return (
    <main className="mx-auto max-w-7xl space-y-6">
      {/* Back navigation and heading */}
      <div>
        <Link
          href="/products"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-violet-700"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-medium text-violet-600">
              Inventory / Product Details
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product.title}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Product ID: {product.id}
            </p>
          </div>

          <Badge status={stockStatus} />
        </div>
      </div>

      {/* Main product information */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProductImageGallery images={product.images ?? []} title={product.title}/>

        {/* Product summary */}
        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold capitalize text-violet-700">
            {product.category}
          </p>

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Product Overview
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-600">
            {product.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Star
              size={18}
              className="fill-amber-400 text-amber-400"
            />
            <span className="font-semibold text-gray-900">
              {product.rating}
            </span>
            <span className="text-sm text-gray-500">
              Product rating
            </span>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Selling Price</p>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold tracking-tight text-gray-900">
                {formatPrice(product.price)}
              </span>

              {product.discountPercentage > 0 && (
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-700">
                  {product.discountPercentage}% off
                </span>
              )}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 p-4">
              <Package size={20} className="text-violet-600" />
              <p className="mt-3 text-xs text-gray-500">
                Available Stock
              </p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {product.stock} units
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <Tag size={20} className="text-violet-600" />
              <p className="mt-3 text-xs text-gray-500">
                Brand
              </p>
              <p className="mt-1 break-words text-lg font-bold text-gray-900">
                {product.brand || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product description and specifications */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
              <MessageSquare size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Product Description
            </h2>
          </div>

          <p className="mt-4 text-sm leading-7 text-gray-600">
            {product.description}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
              <Ruler size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Product Specifications
            </h2>
          </div>

          <dl className="mt-5 divide-y divide-gray-100">
            <div className="flex justify-between gap-4 py-3 text-sm">
              <dt className="text-gray-500">Brand</dt>
              <dd className="text-right font-medium text-gray-900">
                {product.brand || "Not specified"}
              </dd>
            </div>

            <div className="flex justify-between gap-4 py-3 text-sm">
              <dt className="flex items-center gap-2 text-gray-500">
                <Weight size={16} />
                Weight
              </dt>
              <dd className="font-medium text-gray-900">
                {product.weight}
              </dd>
            </div>

            <div className="flex justify-between gap-4 py-3 text-sm">
              <dt className="text-gray-500">Width</dt>
              <dd className="font-medium text-gray-900">
                {product.dimensions.width}
              </dd>
            </div>

            <div className="flex justify-between gap-4 py-3 text-sm">
              <dt className="text-gray-500">Height</dt>
              <dd className="font-medium text-gray-900">
                {product.dimensions.height}
              </dd>
            </div>

            <div className="flex justify-between gap-4 py-3 text-sm">
              <dt className="text-gray-500">Depth</dt>
              <dd className="font-medium text-gray-900">
                {product.dimensions.depth}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Customer reviews */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Customer Reviews
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Feedback associated with this product.
            </p>
          </div>

          <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            {product.reviews.length} reviews
          </span>
        </div>

        {product.reviews.length > 0 ? (
          <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {product.reviews.map((review, index) => (
              <li
                key={`${review.date}-${index}`}
                className="rounded-xl border border-gray-100 bg-gray-50/70 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {review.reviewerName}
                    </h3>
                    <p className="mt-1 break-all text-xs text-gray-500">
                      {review.reviewerEmail}
                    </p>
                  </div>

                  <span className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-700">
                    <Star
                      size={14}
                      className="fill-amber-400 text-amber-400"
                    />
                    {review.rating}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {review.comment}
                </p>

                <p className="mt-4 text-xs text-gray-400">
                  {new Date(review.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
            No reviews available for this product.
          </p>
        )}
      </section>
    </main>
  );
};

export default ProductDetailsPage;
