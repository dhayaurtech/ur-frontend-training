import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOperation } from '@nestjs/swagger';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService:CartService){}

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({summary:'Fetch cart products'})
    getCartItems(@Req() req:any){
        return this.cartService.getCartItems(req.user.userId)
    }

    @UseGuards(JwtAuthGuard)
    @Post('items')
    @ApiOperation({summary:'Add product to cart'})
    async addToCart(@Req() req:any, @Body() body:AddToCartDto){
        return this.cartService.addItemsToCart(req.user.userId, body);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('items/:productId/increment')
    @ApiOperation({summary:'Increment product quantity'})
    async inrementQuantity(@Param('productId') productId:string, @Req() req:any){
        const userId = req.user.userId;
        return this.cartService.incrementQuantity(productId,userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('items/:productId/decrement')
    @ApiOperation({summary:'Decrement product quantity'})
    async derementQuantity(@Param('productId') productId:string, @Req() req:any){
        const userId = req.user.userId;
        return this.cartService.decrementQuantity(productId,userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('items/:productId')
    @ApiOperation({summary:"Delete one product from cart"})
    async deleteProduct(@Param('productId') productId:string, @Req() req:any){
        const userId = req.user.userId;

        return this.cartService.deleteProduct(productId,userId)
    }

}
