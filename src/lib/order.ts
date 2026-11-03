import { OrderResponse } from "@/types/order";
import { cookies } from "next/headers";

export async function getOrders():Promise<OrderResponse[] | null>{
        const coookieStore = await cookies();
        const accessToken = coookieStore.get('accessToken')?.value;

        if(!accessToken){
            return null;
        }

    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`,{
            headers:{
                Cookie:`accessToken=${accessToken}`
            },
            cache:'no-store'
        })

        if(!response.ok){
            throw new Error('Failed to fetch cart');
        }

        const orders:OrderResponse[] = await response.json();

        return orders;

    } catch (error) {
        return null;
    }
}

export async function getOrderById(orderId:string):Promise<OrderResponse | null>{
        const coookieStore = await cookies();
        const accessToken = coookieStore.get('accessToken')?.value;

        if(!accessToken){
            return null;
        }

    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${encodeURIComponent(orderId)}`,{
            headers:{
                Cookie:`accessToken=${accessToken}`
            },
            cache:'no-store'
        })

        if(!response.ok){
            throw new Error('Failed to fetch cart');
        }

        const order:OrderResponse = await response.json();

        return order;

    } catch (error) {
        return null;
    }
}

