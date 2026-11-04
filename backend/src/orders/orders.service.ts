import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto, OrderStatus } from './dto/create-order.dto';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Address, AddressDocument } from '../address/schemas/address.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { CreateAdminOrderDto } from './dto/create-admin-order.dto';


@Injectable()
export class OrdersService {
    constructor(@InjectModel(Order.name) private readonly orderModel:Model<OrderDocument>, @InjectModel(Product.name) private readonly productModel:Model<ProductDocument>, @InjectModel(Address.name) private readonly addressModel:Model<AddressDocument>, @InjectModel(User.name) private readonly userModel:Model<UserDocument>,@InjectModel(Cart.name) private readonly cartModel:Model<CartDocument>){}

    async getAllOrders(page = 1, limit = 10, search = '', status = '', dateRange = '', sort = 'orderDate-ascending') {
        const orders = await this.orderModel.find();
        const filtered = orders.filter((order) => {
            const searchTerm = search.toLowerCase().trim();
            const matchesSearch = String(order._id).toLowerCase().includes(searchTerm) || order.customerName.toLowerCase().includes(searchTerm);
            const matchesStatus = !status || order.orderStatus === status;

            let matchesDateRange = true;

            if (dateRange) {
                const [startDate, endDate] = dateRange.split(',');
                const orderDate = new Date(order.orderDate);

                const start = new Date(startDate);
                const end = new Date(endDate);

                end.setHours(23, 59, 59, 999);

                matchesDateRange = orderDate >= start && orderDate <= end;
            }

            return matchesSearch && matchesStatus && matchesDateRange;
        });

        const [field, direction] = sort.split('-');
        const sorted = [...filtered].sort((a, b) => {
            let comparison = 0;

            switch (field) {
                case 'finalAmount':
                    comparison = a.finalAmount - b.finalAmount;
                    break;

                case 'orderDate':
                    comparison = new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
                    break;

                case 'customerName':
                    comparison = a.customerName.localeCompare(b.customerName);
                    break;

            }

            return direction === 'ascending' ? comparison : -comparison;
        });

        const total = orders.length;
        const revenue = orders.reduce(
        (acc, order) => acc + order.finalAmount,
        0,
        );

        const today = new Date()
        const todayOrders = orders.filter((order) => {
            const orderDate = new Date(order.orderDate);

            return ( orderDate.toLocaleDateString("en-IN", {timeZone: "Asia/Kolkata"}) === today.toLocaleDateString("en-IN", {timeZone: "Asia/Kolkata"}));
        });
        const totalTodayOrders = todayOrders.length;


        const todaysRevenue = todayOrders.reduce((acc,order) => acc + order.finalAmount,0);

        const start = (page - 1) * limit;

        return {
            orders: sorted.slice(start, start + limit),
            revenue,
            total,
            totalTodayOrders,
            todaysRevenue,
            page,
            limit,
        };
    }

    async getOrders(id:string){
        const user = await this.userModel.findById(id);
        if(!user){
            throw new NotFoundException('User not found');
        }

        const orders = await this.orderModel.find({userId:user._id});

        return orders
    }

    async findOneOrder(id:string,userId:string){
        const user = await this.userModel.findById(userId);
        if(!user){
            throw new NotFoundException('User not found');
        }

        const order = await this.orderModel.findById(id);
        if(!order){
            throw new NotFoundException({statusCode:404, message:'Order not found'});
        }
        return order;
    }

    async placeOrder(id:string, body:CreateOrderDto){
        const user = await this.userModel.findById(id);
        if(!user){
            throw new NotFoundException('User not found');
        }

        const address = await this.addressModel.findById(body.addressId);

        if(!address){
            throw new NotFoundException('Address not found');
        }

        let subtotal = 0;
        let totalDiscount = 0;
        const orderItems = [];

        for(const item of body.items){
            const product = await this.productModel.findById(item.productId);

            if(!product){
                throw new NotFoundException('Product not found');
            }

            const price = product.price*item.quantity;

            const discountPercentage = product.discountPercentage ?? 0;

            const discount = (price * discountPercentage) / 100;

            subtotal+=price;
            totalDiscount+=discount;

            orderItems.push({productId:product._id,title:product.title,price:product.price,thumbnail:product.thumbnail,quantity:item.quantity,})
        }

        const deliveryCharge = 50;
        const finalAmount = subtotal - totalDiscount + deliveryCharge;

        const orderDate = new Date();

        const deliveryDate = new Date(orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 7);

        const order = await this.orderModel.create({
            userId:user._id,
            customerName:body.customerName,
            items:orderItems,
            addressId:body.addressId,
            addressDetails:address,
            paymentMethod:body.paymentMethod,
            subTotal:subtotal,
            discount:totalDiscount,
            deliveryCharge,
            finalAmount,
            orderDate:new Date(),
            deliveryDate,
            orderStatus:OrderStatus.PENDING
        })

        await this.cartModel.findOneAndUpdate(
            { userId: user._id },
            { $set: { items: [] } }
        );

        return order;
    }

    async placeOrderByProduct(productId:string, id:string, body:CreateOrderDto){
        const user = await this.userModel.findById(id);
        if(!user){
            throw new NotFoundException('User not found');
        }

        const address = await this.addressModel.findById(body.addressId);

        if(!address){
            throw new NotFoundException('Address not found');
        }

        let subtotal = 0;
        let totalDiscount = 0;
        const orderItems = [];

        for(const item of body.items){
            if(productId !== item.productId){
                throw new BadRequestException("Invalid product");
            }
            const product = await this.productModel.findById(item.productId);
            if(!product){
                throw new NotFoundException('Product not found');
            }

            const price = product.price*item.quantity;

            const discountPercentage = product.discountPercentage ?? 0;

            const discount = (price * discountPercentage) / 100;

            subtotal+=price;
            totalDiscount+=discount;

            orderItems.push({productId:product._id,title:product.title,price:product.price,quantity:item.quantity,thumbnail:product.thumbnail})
        }

        const deliveryCharge = 50;
        const finalAmount = subtotal - totalDiscount + deliveryCharge;

        const orderDate = new Date();

        const deliveryDate = new Date(orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 7);

        const order = await this.orderModel.create({
            userId:user._id,
            customerName:body.customerName,
            items:orderItems,
            addressId:body.addressId,
            addressDetails:address,
            paymentMethod:body.paymentMethod,
            subTotal:subtotal,
            discount:totalDiscount,
            deliveryCharge,
            finalAmount,
            orderDate:new Date(),
            deliveryDate,
            orderStatus:OrderStatus.PENDING
        })

        return order;
    }

async createAdminOrder(body: CreateAdminOrderDto,userId:string) {
  const user = await this.userModel.findById(userId);
        if(!user){
            throw new NotFoundException('User not found');
        }

  const customer = await this.userModel.findById(body.customerId);

if (!customer) {
  throw new NotFoundException("Customer not found");
}

  const address = await this.addressModel.findOne({
    _id: body.addressId,
    userId: customer._id,
  });

  if (!address) {
    throw new NotFoundException("Address not found for this customer");
  }

  if (!body.items?.length) {
    throw new BadRequestException("Order must contain at least one product");
  }

  let subtotal = 0;
  let totalDiscount = 0;

  const orderItems = [];

  const productsToOrder = [];

  for (const item of body.items) {
    const product = await this.productModel.findById(item.productId);

    if (!product) {
      throw new NotFoundException(
        `Product ${item.productId} not found`,
      );
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new BadRequestException("Quantity must be at least 1");
    }

    if (product.stock < item.quantity) {
      throw new BadRequestException(
        `Insufficient stock for ${product.title}. Available: ${product.stock}`,
      );
    }

    const lineTotal = product.price * item.quantity;
    const discountPercentage = product.discountPercentage ?? 0;
    const lineDiscount = (lineTotal * discountPercentage) / 100;

    subtotal += lineTotal;
    totalDiscount += lineDiscount;

    productsToOrder.push({ product, quantity: item.quantity });

    orderItems.push({
      productId: product._id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: item.quantity,
    });
  }

  for (const item of productsToOrder) {
    item.product.stock -= item.quantity;
    await item.product.save();
  }

  const deliveryCharge = 50;
  const finalAmount = subtotal - totalDiscount + deliveryCharge;

  const orderDate = new Date();
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 7);

  return this.orderModel.create({
    userId: customer._id,
    customerName: customer.name,
    items: orderItems,
    addressId: address._id,
    addressDetails: address,
    paymentMethod: body.paymentMethod,
    subTotal: subtotal,
    discount: totalDiscount,
    deliveryCharge,
    finalAmount,
    orderDate,
    deliveryDate,
    orderStatus: OrderStatus.PENDING,
  });
}

    async updateOrderStatus(orderId:string,Orderstatus:OrderStatus,reason?:string){
        const order = await this.orderModel.findById(orderId);

        if(!order){
            throw new NotFoundException('Order not found');
        }

        if(Orderstatus === OrderStatus.CANCELLED){
            const cancellationStatuses: OrderStatus[] = [OrderStatus.PENDING,OrderStatus.PROCESSING];

            if(!cancellationStatuses.includes(order.orderStatus)){
                throw new BadRequestException(`Order cannot be cancelled from ${order.orderStatus} status`)
            }

            if(!reason?.trim()){
                throw new BadRequestException('Cancellation reason is required')
            }

            order.orderStatus = OrderStatus.CANCELLED;
            order.cancellationReason = reason.trim();

            return order.save();
        }

        const allowedStatusTransformation:Record<OrderStatus,OrderStatus | null> = {
            [OrderStatus.PENDING]: OrderStatus.PROCESSING,
            [OrderStatus.PROCESSING]: OrderStatus.SHIPPED,
            [OrderStatus.SHIPPED]: OrderStatus.OUT_FOR_DELIVERY,
            [OrderStatus.OUT_FOR_DELIVERY]: OrderStatus.DELIVERED,
            [OrderStatus.DELIVERED]: null,
            [OrderStatus.CANCELLED]:null
        }
        const nextStatus = allowedStatusTransformation[order.orderStatus];

        if (Orderstatus !== nextStatus) {
            throw new BadRequestException(`Cannot change order status from ${order.orderStatus} to ${Orderstatus}`);
        }

        order.orderStatus = Orderstatus;

        return order.save();
    }
}
