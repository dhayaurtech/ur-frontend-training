"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Input from "../ui/Input";
import Button from "../ui/Button";

import type { AddressResponse } from "@/types/address";
import type { PaymentMethod, CreateOrderPayload } from "@/types/order";
import type { CartItem } from "@/types/cart";
import Select from "../ui/Select";
import Option from "../ui/Option";
import { createOrder, createProductOrder } from "@/lib/order-client";
import { formatPrice } from "@/lib/formatPrice";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "../ui/Toast";

const formSchema = z.object({
  customerName:z.string().min(1,"Customer name is required"),
  address:z.string().trim().min(1,"Please select a delivery address"),
  paymentMethod:z.enum(["cash_on_delivery","pay_pal"],{message:"Please select a valid payment method"})
})

type OrderProps = {
  address: AddressResponse[];
  cartItems: CartItem[];
  buyNow?:boolean
};

type OrderFormInput = z.infer<typeof formSchema>;

const CheckoutPage = ({ address, cartItems, buyNow = false }: OrderProps) => {
  const router = useRouter();

  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");

  const {register, handleSubmit, setValue, watch, formState:{errors,isSubmitting}} = useForm<OrderFormInput>({
    resolver:zodResolver(formSchema),
    mode:'onTouched',
    defaultValues:{
      customerName:"",
      address:"",
      paymentMethod:"cash_on_delivery"
    }
  })

  const selectedAddress = watch("address");
  const paymentMethod = watch("paymentMethod"); 

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );


  const deliveryCharge = 50;

  const onSubmit = async (data:OrderFormInput) => {
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    const orderPayload: CreateOrderPayload = {
      customerName: data.customerName,
      items: cartItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      })),
      addressId: data.address,
      paymentMethod:data.paymentMethod,
    };

    try {

      const order = buyNow ? await createProductOrder(cartItems[0].product._id,orderPayload) : await createOrder(orderPayload);

      if(!order) return;
      setShowToast(true);

      router.push(`/store/order/myOrders`);
    } catch (error) {

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong while saving the product.");
      }

    } 
  };

  return (
    <div className="m-10">
      <form onSubmit={handleSubmit(onSubmit)} className="border-2 rounded-2xl p-10 text-black space-y-6">
        <div>
          <label htmlFor="customerName">Customer Name</label>
          <Input id="customerName" {...register("customerName")} placeholder="Enter customer name"/>
          {errors.customerName && <p className="mt-1 text-sm text-red-500">{errors.customerName.message}</p>}
        </div>

        <div>
          <label>Delivery Address</label>
          <div>
            <h2 className="font-semibold my-3">Current Addresses</h2>
            {address.length === 0 ? (
              <p>No saved addresses found.</p>
            ) : (
              address.map((item) => (
                <label key={item._id} className="flex items-start gap-3 border rounded-lg p-4 mb-3 cursor-pointer">
                  <input type="radio" value={item._id} {...register("address")} className="mt-1"/>
                  <span>
                    <strong>{item.address}</strong>
                    <br />
                    {item.street}, {item.city}
                    <br />
                    PIN: {item.pincode}
                    <br />
                    Landmark: {item.landmark}
                  </span>
                </label>
              ))
            )}
          </div>
          {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
          <Button type="button">
            + Add new address
          </Button>
        </div>

        <div>
          <label htmlFor="paymentMethod">Payment Method</label>
          <Select id="paymentMethod" value={paymentMethod} onChange={(e) => setValue("paymentMethod",e.target.value as OrderFormInput["paymentMethod"],{shouldValidate:true})} >
            <Option value="cash_on_delivery">Cash on Delivery</Option>
            <Option value="pay_pal">Paypal</Option>
          </Select>
          {errors.paymentMethod && <p className="mt-1 text-sm text-red-500">{errors.paymentMethod.message}</p>}
        </div>

        <div>
          <h2 className="font-semibold mb-3">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex justify-between mb-2"> 
              <span className="flex items-center gap-2">
                <img src={item.product.thumbnail} alt={item.product.title} className="object-contain p-2 w-24" />
                {item.product.title} × {item.quantity}
              </span>

              <span>
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}

          <div className="flex justify-between border-t pt-3">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between mt-2">
            <span>Delivery</span>
            <span>{formatPrice(deliveryCharge)}</span>
          </div>

          <div className="flex justify-between font-bold border-t mt-3 pt-3">
            <span>Total</span>
            <span>
              {formatPrice(subtotal + deliveryCharge)}
            </span>
          </div>
        </div>
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
      </form>
      {showToast && (
        <Toast fun={() => setShowToast(false)} message="Order placed successfully"/>
        )}
    </div>
  );
};

export default CheckoutPage;
