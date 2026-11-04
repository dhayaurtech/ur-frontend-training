import { apiClient } from "@/lib/api-client";
import type { AdminCreateOrderPayload, CreateOrderPayload, OrderResponse, OrdersResponse, OrderStatus } from "@/types/order";

export interface GetOrderParams{
    search?:string;
    status?:string;
    dateRange?:string;
    sort?:string;
    page?:number;
    limit?:number;
}

export async function createOrder(payload: CreateOrderPayload) {
  return apiClient.post("/orders", payload);
}

export async function createProductOrder(productId:string,payload:CreateOrderPayload){
  return apiClient.post(`/orders/${encodeURIComponent(productId)}`,payload);
}

export async function getAllOrders(params:GetOrderParams={},options:RequestInit={}):Promise<OrdersResponse>{
  const query = new URLSearchParams();

  if(params.search) query.set('search',String(params.search));
  if(params.status) query.set('status',String(params.status));
  if(params.dateRange) query.set('dateRange',String(params.dateRange));
  if(params.sort) query.set("sort",params.sort)
  if(params.page !== undefined) query.set('page',String(params.page));
  if(params.limit !== undefined) query.set('limit',String(params.limit));

  const suffix = query.toString();
  const data = await apiClient.get<OrdersResponse>(`/orders/admin${suffix ? `?${suffix}`:''}`,options);
  return data;
}

export async function updateOrderStatus(orderId:string,status:OrderStatus,reason?:string):Promise<OrderResponse>{
  return apiClient.patch<OrderResponse>(`/orders/${encodeURIComponent(orderId)}/status`,{status,...(reason && {reason})})
}

export async function createAdminOrder(payload:AdminCreateOrderPayload){
  return apiClient.post("/orders/admin", payload);
}
