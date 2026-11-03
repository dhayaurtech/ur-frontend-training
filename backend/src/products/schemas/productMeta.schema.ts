import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class ProductMeta {
  @Prop({ required: true })
  createdat: Date;

  @Prop({ required: true })
  updatedat: Date;
}

export const ProductMetaSchema = SchemaFactory.createForClass(ProductMeta);