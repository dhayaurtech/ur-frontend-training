import { apiClient } from '@/lib/api-client';
import { isProduct } from '@/lib/guard';
import type {Product} from '../../types/product';

interface ProudctsApiResponse{
    items:Product[];
    total:number;
    page:number;
    limit:number;
}

export interface GetProductsParams{
    page?:number;
    limit?:number;
    search?:string;
    category?:string;
    sort?:string;
}

export async function getProducts(params:GetProductsParams = {},options:RequestInit={}):Promise<ProudctsApiResponse>{
    const query = new URLSearchParams();

    if(params.page !== undefined) query.set('page',String(params.page));
    if(params.limit !== undefined) query.set('limit',String(params.limit));
    if(params.search) query.set('search',String(params.search));
    if(params.category && params.category!=='all'){
        query.set('category',params.category);
    }
    if(params.sort) query.set("sort",params.sort);

    const suffix = query.toString();
    console.log(
  "API request URL:",
  `/products${suffix ? `?${suffix}` : ""}`
);
    const data = await apiClient.get<ProudctsApiResponse>(`/products${suffix ? `?${suffix}`:''}`,options);

    if(!Array.isArray(data.items) || !data.items.every(isProduct) || typeof data.total !== 'number' || typeof data.page !== 'number' || typeof data.limit !== 'number'){
        throw new Error('Invalid products response from server');
    }

    return data;
}

export async function fetchProducts():Promise<Product[]>{
    const data = await getProducts();
    return data.items;
}

export async function getProduct(id:number | string):Promise<Product>{
    const product = await apiClient.get<Product>(`/products/${encodeURIComponent(String(id))}`);

    if(!isProduct(product)){
        throw new Error('Invalid product response from server');
    }

    return product
}

export async function getCategories(options:RequestInit={}):Promise<string[]>{
    const categories = await apiClient.get<string[]>('/products/categories',options);

    if(!Array.isArray(categories) || !categories.every((category) => typeof category === 'string')){
        throw new Error('Invalid categories response from server');
    }
    return categories
}

export async function createProduct(body:{title:string,category:string,brand:string,description:string,price:number,stock:number,images:string[]}):Promise<Product>{
    const product = await apiClient.post<Product>('/products',body);

    if(!isProduct(product)){
        throw new Error('Invalid product response from server');
    }

    return product;
}

export async function updateProduct(id:number | string, body:{title?:string, category?:string, brand?:string, description?:string, price?:number, stock?:number, images?:string[]}):Promise<Product> {
    const product = await apiClient.patch<Product>(`/products/${encodeURIComponent(String(id))}`,body);

    if(!isProduct(product)){
        throw new Error('Invalid product response from server');
    }

    return product;
}

export async function uploadProductImage(file:File): Promise<string>{
    const formData = new FormData();
    formData.append("file",file);

    const response = await apiClient.post<{url:string}>("/products/upload-image",formData);

    if(!response.url){
        throw new Error("image upload failed");
    }

    return response.url;
}

export async function deleteProduct(id:number | string):Promise<Product[]>{
    const products = await apiClient.del<Product[]>(`/products/${encodeURIComponent(String(id))}`);

    return products;
}