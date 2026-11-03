import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsMongoId, IsEnum, IsNotEmpty, IsString, ValidateNested, ArrayMinSize, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";


export enum PaymentMethod{
    COD = 'cash_on_delivery',
    PAY_PAL = 'pay_pal'
}

export enum OrderStatus{
    PENDING='pending',
    PROCESSING='processing',
    SHIPPED='shipped',
    OUT_FOR_DELIVERY='out_for_delivery',
    DELIVERED='delivered',
    CANCELLED='cancelled'
}

export class OrderItemDto{
    @ApiProperty()
    @IsMongoId()
    productId: string;

    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    quantity:number;
}


export class CreateOrderDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    customerName:string;


    @ApiProperty({type: [OrderItemDto]})
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each:true})
    @Type(() => OrderItemDto)
    items: OrderItemDto[]

    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    addressId:string;
    
    @ApiProperty({enum:PaymentMethod})
    @IsEnum(PaymentMethod)
    paymentMethod:PaymentMethod
}