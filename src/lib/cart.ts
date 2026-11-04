
import { CartResponse } from "@/types/cart";
import { cookies } from "next/headers";

export async function getCartItems():Promise<CartResponse | null>{
        const coookieStore = await cookies();
        const accessToken = coookieStore.get('accessToken')?.value;

        if(!accessToken){
            return null;
        }

    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`,{
            headers:{
                Cookie:`accessToken=${accessToken}`
            },
            cache:'no-store'
        })

        if(!response.ok){
            throw new Error('Failed to fetch cart');
        }

        const cart:CartResponse = await response.json();

        return cart;

    } catch (error) {
        return null;
    }
}


