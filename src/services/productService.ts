import { isProduct } from '@/src/lib/guard';
import type {Product, ProductResponse} from '../types/product';

const PRODUCTS_URL = process.env.PRODUCTS_URL;

export async function fetchProducts():Promise<Product[]>{
    try {
        if(!PRODUCTS_URL){
            throw new Error('Products URL is not configured');
        }

        const response = await fetch(PRODUCTS_URL);

        if(!response.ok){
            
            throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data: ProductResponse = await response.json();
    
        if(!isProductResponse(data)){
            throw new Error("Invalid product response");
        }

        return data.products;
    } catch (error) {
        if(error instanceof Error){
            throw error;
        }

        throw new Error('An unexpected error occured while fetching products');
    }
}


function isProductResponse(value:unknown):value is ProductResponse{
    if(typeof value !== "object" ||  value === null){
        return false;
    }

    const data = value as Record<string,unknown>;

    return (Array.isArray(data.products) && data.products.every(isProduct)) &&
    (typeof data.total === "number" && Number.isFinite(data.total)) &&
    (typeof data.skip === "number" && Number.isFinite(data.skip)) &&
    (typeof data.limit === "number" && Number.isFinite(data.limit))
}