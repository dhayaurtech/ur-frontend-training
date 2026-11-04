import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProductMeta, ProductMetaSchema } from './productMeta.schema';
import { ProductDimensions, ProductDimensionsSchema } from './productDimensions.schema';
import { ProductReview, ProductReviewSchema } from './productReview.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @Prop({ required: true, min: 0, max: 5, default: 0 })
  rating: number;

  @Prop({ required: true, trim: true })
  thumbnail: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true, min: 0, max: 100, default: 0 })
  discountPercentage: number;

  @Prop({ required: true, trim: true })
  brand: string;

  @Prop({ type: ProductMetaSchema, required: true })
  meta: ProductMeta;

  @Prop({ type: [ProductReviewSchema], default: [] })
  reviews: ProductReview[];

  @Prop({ required: true, min: 0 })
  weight: number;

  @Prop({ type: ProductDimensionsSchema, required: true })
  dimensions: ProductDimensions;
}

export const ProductSchema = SchemaFactory.createForClass(Product);