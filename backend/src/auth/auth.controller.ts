import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

type AuthenticatedRequest = Request &{
    user:{
        userId:string;
        email:string;
        name:string;
        role:string;
    }
}

const cookieOptions = {
    httpOnly:true,
    secure:process.env.NODE_ENV === 'production',
    sameSite:'lax' as const,
    maxAge:15*60*1000,
    path:'/'
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post('admin/login')
    @ApiOperation({summary:'Admin login'})
    async adminLogin(@Body() body:UserDto, @Res({passthrough:true}) res:Response){
        const result = await this.authService.loginAdmin(body);

        res.cookie('accessToken',result.accessToken,cookieOptions);

        return {message:'Login successful',user:result.user,accessToken:result.accessToken}
    }

    @Post('login')
    @ApiOperation({summary:'User login'})
    async login(@Body() body:UserDto, @Res({passthrough:true}) res:Response){
        const result = await this.authService.loginUser(body);

        res.cookie('accessToken',result.accessToken,cookieOptions);

        return {message:'Login successful',user:result.user,accessToken:result.accessToken}
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({summary:'Fetch user details'})
    async fetchUser(@Req() req:AuthenticatedRequest){
        return this.authService.fetchUser(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/users')
    @ApiOperation({summary:'Fetch all users'})
    async fetchAllUsers(@Req() req:any){
        return this.authService.fetchAllUser(req.user.userId)
    }

    @Post('logout')
    @ApiOperation({summary:'User logout'})
    async logout(@Req() req:Request ,@Res({passthrough:true}) res:Response){
        res.clearCookie('accessToken',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'lax',
            path:'/'
        });
        return {message:'Logout successful'}
    }

}
