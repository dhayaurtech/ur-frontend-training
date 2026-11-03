import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Product, ProductSchema } from "../../products/schemas/product.schema";

export type CartDocument = HydratedDocument<Cart>

@Schema({ _id: false })
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, min: 1, default: 1 })
  quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema()
export class Cart{
    @Prop({type:Types.ObjectId, ref:"User", required:true})
    userId:Types.ObjectId


    @Prop({type:[CartItemSchema],required:true})
    items:CartItem[]
}

export const CartSchema = SchemaFactory.createForClass(Cart);