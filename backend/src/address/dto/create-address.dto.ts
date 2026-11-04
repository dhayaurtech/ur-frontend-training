import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { AddressDetailDto } from "./address.dto";
import { Type } from 'class-transformer'

export class CreateAddressDto{
    @ApiProperty({type:AddressDetailDto})
    @IsObject()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => AddressDetailDto)
    address:AddressDetailDto
}