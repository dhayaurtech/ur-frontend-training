import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './schemas/address.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:Address.name, schema:AddressSchema},
      {name:User.name, schema:UserSchema}
    ]),
    AuthModule
  ],
  controllers: [AddressController],
  providers: [AddressService]
})
export class AddressModule {}
