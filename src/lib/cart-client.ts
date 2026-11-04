import { apiClient } from "@/lib/api-client";
import type { CartResponse } from "@/types/cart";

export async function incrementQuantity(id: string): Promise<CartResponse> {
    return apiClient.patch<CartResponse>(
        `/cart/items/${encodeURIComponent(id)}/increment`,
        {}
    );
}

export async function decrementQuantity(id: string): Promise<CartResponse> {
    return apiClient.patch<CartResponse>(
        `/cart/items/${encodeURIComponent(id)}/decrement`,
        {}
    );
}

export async function deleteProduct(id: string):Promise<CartResponse> {
    return apiClient.delete<CartResponse>(
        `/cart/items/${encodeURIComponent(id)}`
    )
}