import { PartialType } from '@nestjs/mapped-types';
import { AddressDetailDto } from './address.dto';

export class UpdateAddressDto extends PartialType(AddressDetailDto){}
