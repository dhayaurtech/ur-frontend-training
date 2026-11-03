import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class AddressDetailDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address:string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    street:string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    city:string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phoneNumber:string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    pincode:string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    landmark?:string
}