import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { UserDto, UserRole } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';


@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, @InjectModel(User.name) private readonly userModel:Model<UserDocument>) {}

  async loginAdmin(body: UserDto) {

    const user = await this.userModel.findOne({email:body.email}).exec();
    if (
      !user ||
      !(await bcrypt.compare(body.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if(user.role !== UserRole.ADMIN){
      throw new UnauthorizedException('Invalid User');
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role:user.role
    };
 
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        name: user.name,
        email: user.email,
        role:user.role
      },
    };
  }

  async loginUser(body: UserDto) {
    
    const user = await this.userModel.findOne({email:body.email})
    if (
      !user ||
      !(await bcrypt.compare(body.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if(user.role !== UserRole.USER){
      throw new UnauthorizedException('Invalid User');
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role:user.role
    };
 
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        name: user.name,
        email: user.email,
        role:user.role
      },
    };
  }

  async fetchUser(userId:string){
    const user = await this.userModel.findById(userId);
    if(!user){
      throw new UnauthorizedException('User not found');
    }

    return {
      id:user._id,
      name:user.name,
      email:user.email,
      role:user.role
    }
  }

  async fetchAllUser(userId:string){
    const admin = await this.userModel.findById(userId);
    if(!admin){
      throw new UnauthorizedException('Admin not found');
    }
    const users = await this.userModel.find({role:UserRole.USER});
    return users;
  }
}
