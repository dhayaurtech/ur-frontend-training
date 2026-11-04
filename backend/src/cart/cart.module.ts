import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:Cart.name, schema:CartSchema},
      {name:User.name, schema:UserSchema},
      {name:Product.name, schema:ProductSchema}
    ]),
    AuthModule
  ],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
