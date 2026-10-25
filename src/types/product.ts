export interface Product{
    id:number;
    title:string;
    description:string;
    category:string;
    price:number;
    stock:number;
    rating?:number;
    thumbnail:string;
    images:[];
    discountPercentage:number;
    brand:string;
    meta:{
        createdAt:string;
    }
    reviews:[
        {
            rating:string;
            comment:string;
            date:string;
            reviewerName:string;
            reviewerEmail:string;
        }
    ];
    weight:number;
    dimensions:{
        width:string;
        height:string;
        depth:string;
    }

}

export interface ProductResponse{
    products:Product[];
    total:number;
    skip:number;
    limit:number;
}

export type SortBy = "title" | "price" | "createdat";
export type SortDirection = "ascending" | "descending";

export type ProductCategory = string | "all";
export type ProductBrand = string | "all";