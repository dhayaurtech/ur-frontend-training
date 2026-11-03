import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UserRole } from "../dto/user.dto";

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps:true})
export class User{
    @Prop({required:true, trim:true})
    name:string

    @Prop({required:true, unique:true, lowercase:true, trim:true})
    email:string;

    @Prop({required:true})
    password:string;

    @Prop({required:true, enum:UserRole, default:UserRole.USER})
    role:UserRole
}

export const UserSchema = SchemaFactory.createForClass(User);