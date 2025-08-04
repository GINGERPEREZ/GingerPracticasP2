import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderResponseDto } from '../dto/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string): Promise<OrderResponseDto[]> {
    if (userId) {
      return this.orderService.findByUser(userId);
    }
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<OrderResponseDto> {
    return this.orderService.findOne(id);
  }

  @Get(':id/summary')
  getOrderSummary(@Param('id') id: string): Promise<any> {
    return this.orderService.getOrderSummary(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
    return this.orderService.updateStatus(id, updateOrderStatusDto);
  }

  @Post('checkout')
  checkout(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderService.create(createOrderDto);
  }
} 