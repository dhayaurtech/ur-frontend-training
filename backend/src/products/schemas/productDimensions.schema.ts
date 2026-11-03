import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class ProductDimensions {
  @Prop({ required: true, min: 0 })
  width: number;

  @Prop({ required: true, min: 0 })
  height: number;

  @Prop({ required: true, min: 0 })
  depth: number;
}

export const ProductDimensionsSchema = SchemaFactory.createForClass(ProductDimensions);