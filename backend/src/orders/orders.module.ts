import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { Address, AddressSchema } from '../address/schemas/address.schema';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Cart, CartSchema } from '../cart/schemas/cart.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:Order.name, schema:OrderSchema},
      {name:Product.name, schema:ProductSchema},
      {name:Address.name, schema:AddressSchema},
      {name:User.name, schema:UserSchema},
      {name:Cart.name, schema:CartSchema}
    ]),
    AuthModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
