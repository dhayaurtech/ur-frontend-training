import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { OrderStatus } from './create-order.dto';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  @MinLength(1)
  reason?:string;
}