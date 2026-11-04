import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule, ConfigService} from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AddressModule } from './address/address.module';
import { CartModule } from './cart/cart.module';
@Module({
  imports: [ 
    ConfigModule.forRoot({isGlobal:true}), 
    MongooseModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI')
      })
    }),
    ProductsModule, AuthModule, OrdersModule, AddressModule, CartModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
