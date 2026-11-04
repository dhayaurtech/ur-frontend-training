
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { AuthUser } from "@/lib/auth";
import type { Product } from "@/types/product";
import type { AddressResponse } from "@/types/address";
import type {
  AdminCreateOrderPayload,
  PaymentMethod,
} from "@/types/order";

import Select from "../ui/Select";
import Option from "../ui/Option";
import { formatPrice } from "@/lib/formatPrice";
import { createAdminOrder } from "@/lib/order-client";
import Button from "../ui/Button";
import Input from "../ui/Input";

const formSchema = z.object({
  customerId: z.string().trim().min(1, "Please select a customer"),
  addressId: z.string().trim().min(1, "Please select a customer address"),
  paymentMethod: z.enum(["cash_on_delivery", "pay_pal"]),
});

type OrderFormInput = z.infer<typeof formSchema>;

type CartItem = Product & {
  quantity: number;
};

type OrderCreateProps = {
  users: AuthUser[];
  products: Product[];
  addresses: AddressResponse[];
};

const SHIPPING_CHARGE = 50;

const OrderCreate = ({
  users,
  products,
  addresses,
}: OrderCreateProps) => {
  const router = useRouter();

  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<CartItem[]>([]);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormInput>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      customerId: "",
      addressId: "",
      paymentMethod: "cash_on_delivery",
    },
  });

  const selectedCustomerId = watch("customerId");
  const selectedAddressId = watch("addressId");
  const paymentMethod = watch("paymentMethod");

  const selectedCustomer = users.find(
    (user) => String(user._id) === selectedCustomerId
  );

  const userAddresses = addresses.filter(
    (address) => String(address.userId) === selectedCustomerId
  );

  const subtotal = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalDiscount = selectedProducts.reduce((sum, item) => {
    const discountPercentage = item.discountPercentage ?? 0;
    const lineTotal = item.price * item.quantity;

    return sum + (lineTotal * discountPercentage) / 100;
  }, 0);

  const total = subtotal - totalDiscount + SHIPPING_CHARGE;

  const customerField = register("customerId");
  const addressField = register("addressId");
  const paymentField = register("paymentMethod");

  const handleAddProduct = () => {
    setError("");

    const product = products.find(
      (item) => String(item._id) === selectedProductId
    );

    if (!product) return;

    if (product.stock <= 0) {
      setError("This product is out of stock.");
      return;
    }

    if (
      selectedProducts.some(
        (item) => String(item._id) === selectedProductId
      )
    ) {
      setError("This product has already been added.");
      return;
    }

    setSelectedProducts((prev) => [
      ...prev,
      { ...product, quantity: 1 },
    ]);

    setSelectedProductId("");
  };

  const handleQuantityChange = (
    productId: string,
    rawValue: string
  ) => {
    if (rawValue === "") return;

    const quantity = Number(rawValue);

    if (!Number.isInteger(quantity) || quantity < 1) return;

    setSelectedProducts((prev) =>
      prev.map((item) => {
        if (String(item._id) !== productId) return item;

        if (quantity > item.stock) {
          setError(
            `Only ${item.stock} units of ${item.title} are available.`
          );
          return item;
        }

        setError("");
        return { ...item, quantity };
      })
    );
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.filter((item) => String(item._id) !== productId)
    );

    setError("");
  };

  const onSubmit = async (data: OrderFormInput) => {
    setError("");

    if (selectedProducts.length === 0) {
      setError("Please add at least one product.");
      return;
    }

    const orderPayload: AdminCreateOrderPayload = {
      customerId: data.customerId,
      addressId: data.addressId,
      paymentMethod: data.paymentMethod,
      items: selectedProducts.map((item) => ({
        productId: String(item._id),
        quantity: item.quantity,
      })),
    };

    try {
      await createAdminOrder(orderPayload);

      router.replace("/orders");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create order."
      );
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 text-black lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="mb-6 text-2xl font-bold">Create Order</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Customer */}
          <section className="mb-6 rounded-lg border border-violet-200 drop-shadow-lg bg-violet-200 p-4">
            <h2 className="mb-4 text-lg font-semibold">
              Select Customer
            </h2>

            <Select
              {...customerField}
              value={selectedCustomerId}
              onChange={(e) => {
                customerField.onChange(e);

                setValue("addressId", "", {
                  shouldValidate: true,
                });
              }}
            >
              <Option value="">Choose a customer</Option>

              {users.map((user) => (
                <Option key={user._id} value={String(user._id)}>
                  {user.name}
                </Option>
              ))}
            </Select>

            {errors.customerId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customerId.message}
              </p>
            )}
          </section>

          <section className="mb-6 rounded-lg border p-4 border-violet-200 drop-shadow-lg bg-violet-200">
            <h2 className="mb-4 text-lg font-semibold">
              Select Products
            </h2>

            <Select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <Option value="">Choose a product</Option>

              {products.map((product) => (
                <Option
                  key={product._id}
                  value={String(product._id)}
                >
                  {product.title} — {formatPrice(product.price)} (Stock:{" "}
                  {product.stock})
                </Option>
              ))}
            </Select>

            <Button
              type="button"
              onClick={handleAddProduct}
              disabled={!selectedProductId}
              className="mt-3 rounded px-4 py-2 text-white disabled:opacity-50"
            >
              Add Product
            </Button>

            <h3 className="mt-5 mb-3 font-medium">
              Selected Products
            </h3>

            {selectedProducts.length === 0 && (
              <p className="text-gray-500">
                No products selected.
              </p>
            )}

            <ul className="space-y-3">
              {selectedProducts.map((item) => (
                <li
                  key={item._id}
                  className="border p-4 border-violet-100 drop-shadow-lg bg-white rounded-2xl"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        Stock: {item.stock}
                      </p>
                    </div>

                    <div>
                      <label htmlFor={`quantity-${item._id}`}>
                        Quantity
                      </label>

                      <Input
                        id={`quantity-${item._id}`}
                        type="number"
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            String(item._id),
                            e.target.value
                          )
                        }
                        className="w-full rounded border-2 p-2"
                      />
                    </div>

                    <div>
                      <p>Unit price</p>
                      <p>{formatPrice(item.price)}</p>
                    </div>

                    <div>
                      <p>Line total</p>
                      <p>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>

                  <Button
                  variant="danger"
                    type="button"
                    onClick={() =>
                      handleRemoveProduct(String(item._id))
                    }
                    className="mt-3 text-sm text-red-600"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </section>

          {/* Address */}
          <section className="mb-6 rounded-lg border p-4 border-violet-200 drop-shadow-lg bg-violet-200">
            <h2 className="mb-4 text-lg font-semibold">
              Customer Address
            </h2>

            {!selectedCustomerId && (
              <p className="text-gray-500">
                Select a customer first.
              </p>
            )}

            {selectedCustomerId && userAddresses.length === 0 && (
              <p className="text-gray-500">
                This customer has no saved addresses.
              </p>
            )}

            <Select
              {...addressField}
              value={selectedAddressId}
              onChange={addressField.onChange}
              disabled={!selectedCustomerId}
            >
              <Option value="">Choose an address</Option>

              {userAddresses.map((address) => (
                <Option
                  key={address._id}
                  value={String(address._id)}
                >
                  {address.address}, {address.street}, {address.city} —{" "}
                  {address.pincode}
                </Option>
              ))}
            </Select>

            {errors.addressId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.addressId.message}
              </p>
            )}
          </section>

          {/* Payment */}
          <section className="mb-6 rounded-lg border p-4 border-violet-200 drop-shadow-lg bg-violet-200">
            <h2 className="mb-4 text-lg font-semibold">
              Payment Method
            </h2>

            <Select
              {...paymentField}
              value={paymentMethod}
              onChange={paymentField.onChange}
            >
              <Option value="cash_on_delivery">
                Cash on Delivery
              </Option>

              <Option value="pay_pal">PayPal</Option>
            </Select>

            {errors.paymentMethod && (
              <p className="mt-1 text-sm text-red-600">
                {errors.paymentMethod.message}
              </p>
            )}
          </section>

          {error && (
            <p className="mb-4 text-red-600">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="disabled:opacity-50"
          >
            {isSubmitting ? "Creating order..." : "Create Order"}
          </Button>
        </form>
      </div>

      {/* Summary */}
      <aside className="h-fit rounded-lg border p-4 border-violet-200 drop-shadow-lg bg-violet-200">
        <h2 className="mb-4 text-lg font-semibold">
          Order Summary
        </h2>

        <p className="text-sm text-gray-500">Customer</p>

        <p className="mb-4 font-medium">
          {selectedCustomer?.name ?? "Select a customer"}
        </p>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>- {formatPrice(totalDiscount)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>+ {formatPrice(SHIPPING_CHARGE)}</span>
          </div>

          <hr />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default OrderCreate;