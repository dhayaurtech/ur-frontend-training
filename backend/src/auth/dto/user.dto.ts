import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export enum UserRole{
    ADMIN="admin",
    USER="user"
}

export class UserDto{
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    password:string;
}