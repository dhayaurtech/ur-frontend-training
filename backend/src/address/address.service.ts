import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Address, AddressDocument } from './schemas/address.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
    constructor(@InjectModel(User.name) private readonly userModel:Model<UserDocument>, @InjectModel(Address.name) private readonly addressModel:Model<AddressDocument>){}

    async getAllAddress(id:string){
        const user = await this.userModel.findById(id);

        if(!user){
            throw new NotFoundException('User not found');
        }

        const addresses = await this.addressModel.find();
        return addresses;
    }
    async getAddress(id:string){
        const user = await this.userModel.findById(id);

        if(!user){
            throw new NotFoundException('User not found');
        }
        const address = await this.addressModel.find({userId:user._id});
        return address;
    }

    async createAddress(id:string,body:CreateAddressDto){
        const user = await this.userModel.findById(id);

        if(!user){
            throw new NotFoundException('User not found');
        }

        const newAdress = await this.addressModel.create({
            userId:user._id,
            ...body.address
        })

        return newAdress;
    }

    async updateAddress(addressId:string, userId:string, body:UpdateAddressDto){
        const user = await this.userModel.findById(userId);
        if(!user){
            throw new NotFoundException('User not found');
        }
        const address = await this.addressModel.findById(addressId);
        if(!address){
            throw new NotFoundException("Address not found");
        }
        Object.assign(address,body);

        await address.save();

        return address;
    }

    async deleteAddress(addressId:string){
        const deletedAddress = await this.addressModel.findByIdAndDelete(addressId);

        if(!deletedAddress){
            throw new NotFoundException('Address not found');
        }

        return deletedAddress;
    }
}

