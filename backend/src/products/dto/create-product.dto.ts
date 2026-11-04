import { IsString, IsNumber, Min, IsNotEmpty, IsArray, IsInt, IsUrl } from "class-validator";

export class CreateProductDto{
    @IsString()
    @IsNotEmpty()
    title:string;

    @IsString()
    @IsNotEmpty()
    category:string;

    @IsString()
    @IsNotEmpty()
    brand:string;

    @IsString()
    @IsNotEmpty()
    description:string;

    @IsNumber()
    @Min(0)
    price:number;

    @IsInt()
    @Min(0)
    stock:number;

    @IsArray()
    @IsUrl({require_tld:false},{each:true})
    images:string[]
}