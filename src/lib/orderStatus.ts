import { OrderStatus } from '@/types/order';

export const nextOrderStatus: Record<OrderStatus, OrderStatus | null> = {
  pending: 'processing',
  processing: 'shipped',
  shipped: 'out_for_delivery',
  out_for_delivery: 'delivered',
  delivered: null,
};