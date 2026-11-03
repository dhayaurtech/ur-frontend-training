import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateAddressDto } from './dto/create-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('address')
export class AddressController {
    constructor(private readonly addressService:AddressService){}

    @UseGuards(JwtAuthGuard)
    @Get('/all')
    @ApiOperation({summary:'Fetch all user addresses'})
    getAllAddress(@Req() req:any){
        return this.addressService.getAllAddress(req.user.userId)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({summary:'Fetch user addresses'})
    getAddress(@Req() req:any){
        return this.addressService.getAddress(req.user.userId)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({summary: 'Create new address'})
    createAddress(@Req() req:any, @Body() body:CreateAddressDto){
        return this.addressService.createAddress(req.user.userId,body);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiOperation({summary:'Update an address'})
    updateAddress(@Param('id') addressId:string, @Body() body:UpdateAddressDto, @Req() req:any){
        const userId = req.user.userId;
        return this.addressService.updateAddress(addressId,userId,body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    @ApiOperation({summary:"Delete a address by ID"})
    deleteAddress(@Param('id') id:string){
        return this.addressService.deleteAddress(id)
    }
}
