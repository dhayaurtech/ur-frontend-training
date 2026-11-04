import { AddressResponse } from "./address";

export type PaymentMethod = "cash_on_delivery" | "pay_pal";
export type OrderStatus = "pending" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";

export type CreateOrderItem = {
  productId: string;
  quantity: number;
};

export type CreateOrderPayload = {
  customerName: string;
  items: CreateOrderItem[];
  addressId: string;
  paymentMethod: PaymentMethod;
};

export type AdminCreateOrderPayload = {
  customerId: string;
  items: CreateOrderItem[];
  addressId: string;
  paymentMethod: PaymentMethod;
};

export type OrderItem = {
  productId:string;
  title:string;
  price:number;
  quantity:number;
  thumbnail:string;
}

export type OrderResponse = {
  _id:string;
  userId:string;
  customerName:string;
  items:OrderItem[];
  subTotal:number;
  finalAmount:number;
  discount:number;
  deliveryCharge:number;
  addressId:string;
  addressDetails:AddressResponse;
  paymentMethod:PaymentMethod;
  orderDate:Date;
  deliveryDate:Date;
  orderStatus:OrderStatus
}

export type OrdersResponse = {
  orders:OrderResponse[],
  revenue:number;
  total:number;
  totalTodayOrders:number;
  todaysRevenue:number;
  page:number;
  limit:number;
}

export type OrderSortBy = "finalAmount" | "orderDate" | "customerName";