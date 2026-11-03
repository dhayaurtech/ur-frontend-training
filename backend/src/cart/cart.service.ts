import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
    constructor(@InjectModel(Cart.name) private readonly cartModel:Model<CartDocument>, @InjectModel(User.name) private readonly userModel:Model<UserDocument>, @InjectModel(Product.name) private readonly productModel:Model<ProductDocument>){}

    async getCartItems(id:string){
        const user = await this.userModel.findById(id);

        if(!user){
            throw new NotFoundException('User not found');
        }

        const cart = await this.cartModel.findOne({ userId: user._id });

        if (!cart) {
            return {cartItem:[],cartTotal:0}
        }

        const cartItems = cart.items;

        const cartItem = []

        let cartTotal = 0;

        for(const item of cartItems){
            const product = await this.productModel.findById(item.productId);

            if(!product){
                throw new NotFoundException('Product not found');
            }
            cartItem.push({product,quantity:item.quantity})
            cartTotal += product.price*item.quantity;
        }

        return {cartItem,cartTotal};
    }

    async addItemsToCart(id:string,body:AddToCartDto){
        const user = await this.userModel.findById(id);

        if(!user){
            throw new NotFoundException('User not found');
        } 

        let cart = await this.cartModel.findOne({ userId: user._id });

        if (!cart) {
            cart = new this.cartModel({userId:user._id,items:[]})
        }
        
        const existingItem = cart.items.find(
            item => item.productId.toString() === body.productId
        );

        if (existingItem) {
            existingItem.quantity += body.quantity;
        } else {
            cart.items.push({
                productId: new Types.ObjectId(body.productId),
                quantity: body.quantity,
            });
        }

        await cart.save();

        return cart;
    }

    async incrementQuantity(productId:string,userId:string){
        const user = await this.userModel.findById(userId);
        if(!user){
            throw new NotFoundException('User not found');
        }

        const cart = await this.cartModel.findOne({userId:user._id});

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const cartItem = cart.items.find((item) => String(item.productId) === productId);

        if (!cartItem) {
            throw new NotFoundException('Product not found in cart');
        }

        if(cartItem.quantity>=10){
            throw new BadRequestException('Maximum quantity is 10')
        }

        cartItem.quantity += 1;

        await cart.save();

        return this.getCartItems(userId);

    }

    async decrementQuantity(productId:string,userId:string){
        const user = await this.userModel.findById(userId);
        if(!user){
            throw new NotFoundException('User not found');
        }

        const cart = await this.cartModel.findOne({userId:user._id});

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const cartItem = cart.items.find((item) => String(item.productId) === productId);

        if (!cartItem) {
            throw new NotFoundException('Product not found in cart');
        }

        if(cartItem.quantity<=1){
            throw new BadRequestException('Minimum quantity is 1')
        }

        cartItem.quantity -= 1;

        await cart.save();

        return this.getCartItems(userId);

    }

    async deleteProduct(productId:string, userId:string){
        const user = await this.userModel.findById(userId);
        if(!user){
            throw new NotFoundException('User not found');
        }

        const cart = await this.cartModel.findOne({userId:user._id});

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const cartItem = cart.items.find((item) => String(item.productId) === productId);

        if (!cartItem) {
            throw new NotFoundException('Product not found in cart');
        }

        cart.items = cart.items.filter(
            (item) => String(item.productId) !== productId
        );

        await cart.save();

        return this.getCartItems(userId);
    }
}
