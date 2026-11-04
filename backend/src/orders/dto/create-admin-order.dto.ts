import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  ValidateNested,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { PaymentMethod } from "./create-order.dto";

class AdminOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateAdminOrderDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  addressId: string;

  @IsEnum(PaymentMethod)
  paymentMethod:PaymentMethod

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminOrderItemDto)
  items: AdminOrderItemDto[];
}