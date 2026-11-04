"use client";

import { useState } from "react";
import type { CartItem, CartResponse } from "@/types/cart";
import Button from "../ui/Button";
import {
  decrementQuantity,
  deleteProduct,
  incrementQuantity,
} from "@/lib/cart-client";
import Link from "next/link";

type CartTableProps = {
  cartItem: CartItem[];
  cartTotal: number;
};

const CartTable = ({ cartItem, cartTotal }: CartTableProps) => {
  const [items, setItems] = useState(cartItem);
  const [total, setTotal] = useState(cartTotal);
  const [loading, setLoading] = useState<string | null>(null);

  const updateCart = (cart: CartResponse) => {
    setItems(cart.cartItem);
    setTotal(cart.cartTotal);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);

  const handleIncrement = async (id: string) => {
    try {
      setLoading(id);
      const cart = await incrementQuantity(id);
      updateCart(cart);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update cart");
    } finally {
      setLoading(null);
    }
  };

  const handleDecrement = async (id: string) => {
    try {
      setLoading(id);
      const cart = await decrementQuantity(id);
      updateCart(cart);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update cart");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(id);
      const cart = await deleteProduct(id);
      updateCart(cart);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update cart");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Shopping Cart
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Review your items and proceed to checkout.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
              🛒
            </div>

            <h2 className="text-xl font-semibold">Your cart is empty</h2>

            <p className="mt-2 text-gray-500">
              Looks like you haven't added anything to your cart yet.
            </p>

            <Link href="/store/products">
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">

              {/* Desktop Table */}
              <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-4 py-4">Price</th>
                      <th className="px-4 py-4">Quantity</th>
                      <th className="px-4 py-4">Subtotal</th>
                      <th className="px-4 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {items.map((prod) => (
                      <tr key={prod.product._id}>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              <img
                                src={prod.product.thumbnail}
                                alt={prod.product.title}
                                className="object-contain p-2"
                                sizes="64px"
                              />
                            </div>

                            <div>
                              <p className="font-semibold text-gray-900">
                                {prod.product.title}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-5 text-sm text-gray-600">
                          {formatPrice(prod.product.price)}
                        </td>

                        <td className="px-4 py-5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDecrement(prod.product._id)}
                              disabled={loading === prod.product._id || prod.quantity <= 1}
                              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              −
                            </button>

                            <span className="min-w-6 text-center text-sm font-medium">
                              {loading === prod.product._id ? "..." : prod.quantity}
                            </span>

                            <button
                              onClick={() => handleIncrement(prod.product._id)}
                              disabled={loading === prod.product._id || prod.quantity >= 10}
                              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="px-4 py-5 font-semibold text-gray-900">
                          {formatPrice(prod.product.price * prod.quantity)}
                        </td>

                        <td className="px-4 py-5">
                          <button
                            onClick={() => handleDelete(prod.product._id)}
                            disabled={loading === prod.product._id}
                            className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Product Cards */}
              <div className="space-y-4 md:hidden">
                {items.map((prod) => (
                  <div
                    key={prod.product._id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={prod.product.thumbnail}
                          alt={prod.product.title}
                          className="object-contain p-2 w-24"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {prod.product.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {formatPrice(prod.product.price)}
                        </p>

                        <p className="mt-2 font-semibold text-gray-900">
                          {formatPrice(prod.product.price * prod.quantity)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDecrement(prod.product._id)}
                          disabled={loading === prod.product._id || prod.quantity <= 1}
                          className="h-8 w-8 rounded-md border border-gray-300 disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="min-w-6 text-center text-sm font-medium">
                          {loading === prod.product._id ? "..." : prod.quantity}
                        </span>

                        <button
                          onClick={() => handleIncrement(prod.product._id)}
                          disabled={loading === prod.product._id || prod.quantity >= 10}
                          className="h-8 w-8 rounded-md border border-gray-300 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleDelete(prod.product._id)}
                        disabled={loading === prod.product._id}
                        className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/store/products"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Calculated at checkout</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">
                      Cart Total
                    </span>

                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              <Link href="/store/order/checkout" className="mt-6 block">
                <Button variant="primary" >
                  Proceed to Checkout
                </Button>
              </Link>

              <p className="mt-4 text-center text-xs text-gray-500">
                Secure checkout · Your order is protected
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTable;