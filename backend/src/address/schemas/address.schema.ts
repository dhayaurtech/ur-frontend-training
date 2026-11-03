import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Types } from "mongoose"

export type AddressDocument = HydratedDocument<Address>

@Schema()
export class Address{
    @Prop({type:Types.ObjectId, ref:'User',required:true})
    userId:Types.ObjectId
    
    @Prop({required:true, trim:true})
    address:string

    @Prop({required:true, trim:true})
    street:string

    @Prop({required:true, trim:true})
    city:string

    @Prop({required:true, trim:true})
    pincode:string

    @Prop({required:true, trim:true})
    landmark:string
}

export const AddressSchema = SchemaFactory.createForClass(Address)
