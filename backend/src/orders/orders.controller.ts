import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CreateAdminOrderDto } from './dto/create-admin-order.dto';


@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService:OrdersService){}

    @UseGuards(JwtAuthGuard)
    @Get('/admin')
    @ApiOperation({summary:'Fetch All orders'})
    getAllOrders(
        @Query('page') page = "1",
        @Query('limit') limit = '10',
        @Query('search') search = '',
        @Query('status') status ='',
        @Query('dateRange') dateRange ='',
        @Query('sort') sort = "orderDate-ascending"
    ){
        return this.ordersService.getAllOrders(
            Math.max(1,Number(page) || 1),
            Math.min(100,Math.max(1,Number(limit) || 10)),
            search,
            status,
            dateRange,
            sort
        )
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({summary:'Fetch orders by userId'})
    getOrders(@Req() req:any){
        return this.ordersService.getOrders(req.user.userId)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({summary:"Fetch a specific order by id"})
    async getOrderById(@Param('id') orderId:string, @Req() req:any){

        return this.ordersService.findOneOrder(orderId,req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({summary:'Place an order'})
    async orderPlaced(@Req() req:any, @Body() body:CreateOrderDto){
        return this.ordersService.placeOrder(req.user.userId, body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/admin')
    @ApiOperation({ summary: 'Create an order for a customer (admin)' })
    async createAdminOrder(@Body() body: CreateAdminOrderDto, @Req() req:any) {
        return this.ordersService.createAdminOrder(body,req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':productId')
    @ApiOperation({summary:"Place a product order"})
    async orderPlacedByProduct(@Param('productId') productId:string, @Req() req:any, @Body() body:CreateOrderDto){
        return this.ordersService.placeOrderByProduct(productId, req.user.userId, body);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    @ApiOperation({summary:'Update order status'})
    async updateOrderStatus(@Param('id') orderId:string, @Body() body:UpdateOrderStatusDto){
        return this.ordersService.updateOrderStatus(orderId,body.status,body.reason);
    }
}
