import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:User.name, schema:UserSchema}
    ]),
    JwtModule.register({
      secret:'shop-desk-app-secret-key',
      signOptions:{expiresIn:'15m'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports:[JwtModule,JwtAuthGuard]
})
export class AuthModule {}
