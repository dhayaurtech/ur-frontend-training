import type { Product } from "@/src/types/product";

export function isProduct(value:unknown):value is Product{

    if(typeof value!== "object" || value === null){
        return false;
    }

    const val = value as Record<string,unknown>;

    return (
        (typeof val.id === "number" && Number.isFinite(val.id)) &&
        (typeof val.title === "string") &&
        (typeof val.description === "string") &&
        (typeof val.category === "string") &&
        (typeof val.price === "number" && Number.isFinite(val.price)) &&
        (typeof val.stock === "number" && Number.isFinite(val.stock)) &&
        (typeof val.rating === "number" && Number.isFinite(val.rating)) &&
        (typeof val.thumbnail === "string")
    )
}