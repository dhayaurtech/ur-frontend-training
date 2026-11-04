import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class ProductReview {
  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true, trim: true })
  comment: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, trim: true })
  reviewerName: string;

  @Prop({ required: true, trim: true, lowercase: true })
  reviewerEmail: string;
}

export const ProductReviewSchema = SchemaFactory.createForClass(ProductReview);