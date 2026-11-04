import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { OrderStatus, PaymentMethod } from "../dto/create-order.dto";
import { Address, AddressSchema } from "../../address/schemas/address.schema";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({required:true, trim:true})
  thumbnail?:string;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({timestamps:true})
export class Order{
    @Prop({type:Types.ObjectId, ref:'User', required:true})
    userId:Types.ObjectId
    
    @Prop({required:true, trim:true})
    customerName:string;

    @Prop({type:[OrderItemSchema],required:true})
    items:OrderItem[]

    @Prop({required:true})
    subTotal:number

    @Prop({required:true})
    finalAmount:number

    @Prop({required:false, min:0})
    discount:number

    @Prop({required:true})
    deliveryCharge:number
    
    @Prop({type:Types.ObjectId, ref:'Address', required:true})
    addressId: Types.ObjectId

    @Prop({type:AddressSchema, required:true})
    addressDetails:Address

    @Prop({required:true, enum:PaymentMethod, default:PaymentMethod.COD})
    paymentMethod:PaymentMethod

    @Prop({required:true, default:Date.now})
    orderDate:Date

    @Prop({required:true})
    deliveryDate:Date

    @Prop({required:true, enum:OrderStatus, default:OrderStatus.PENDING})
    orderStatus:OrderStatus

    @Prop({required:false, trim:true})
    cancellationReason?:string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);