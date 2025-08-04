import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentMethod } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { Customization } from '../entities/customization.entity';
import { CreateOrderDto, UpdateOrderStatusDto, OrderResponseDto, OrderItemDto, OrderSummaryDto } from '../dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Customization)
    private customizationRepository: Repository<Customization>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    // Calculate order totals
    const { subtotal, orderItems } = await this.calculateOrderTotals(createOrderDto.orderItems);
    
    // Calculate shipping cost
    const shippingCost = this.calculateShippingCost(subtotal);
    const total = subtotal + shippingCost;

    // Create order with orderItems as JSON
    const order = this.orderRepository.create({
      userId: createOrderDto.userId,
      paymentMethod: createOrderDto.paymentMethod,
      subtotal,
      shippingCost,
      total,
      shippingAddress: createOrderDto.shippingAddress,
      postalCode: createOrderDto.postalCode,
      city: createOrderDto.city,
      country: createOrderDto.country,
      orderItems: orderItems,
    });

    const savedOrder = await this.orderRepository.save(order);

    return this.findOne(savedOrder.id);
  }

  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      order: { createdAt: 'DESC' }
    });
    return orders.map(order => this.mapToResponseDto(order));
  }

  async findByUser(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
    return orders.map(order => this.mapToResponseDto(order));
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id }
    });
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    return this.mapToResponseDto(order);
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({ where: { id } });
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Validate status transition
    if (!this.isValidStatusTransition(order.status, updateOrderStatusDto.status)) {
      throw new BadRequestException(`Invalid status transition from ${order.status} to ${updateOrderStatusDto.status}`);
    }
    
    order.status = updateOrderStatusDto.status as OrderStatus;
    const updatedOrder = await this.orderRepository.save(order);
    
    return this.findOne(updatedOrder.id);
  }

  async getOrderSummary(id: string): Promise<OrderSummaryDto> {
    const order = await this.findOne(id);
    
    return {
      orderId: order.id,
      status: order.status,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      itemCount: order.orderItems.length,
      createdAt: order.createdAt
    } as OrderSummaryDto;
  }

  private async calculateOrderTotals(orderItems: OrderItemDto[]): Promise<{ subtotal: number, orderItems: any[] }> {
    let subtotal = 0;
    const calculatedItems = [];

    for (const item of orderItems) {
      // Get product price
      const product = await this.productRepository.findOne({
        where: { id: item.productId, isActive: true }
      });
      
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      let unitPrice = product.basePrice;
      let customizationPrice = 0;

      // Add customization price if exists
      if (item.customizationId) {
        const customization = await this.customizationRepository.findOne({
          where: { id: item.customizationId }
        });
        
        if (customization) {
          customizationPrice = customization.customizationPrice;
          unitPrice += customizationPrice;
        }
      }

      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      calculatedItems.push({
        ...item,
        unitPrice,
        totalPrice,
        customizationPrice
      });
    }

    return { subtotal, orderItems: calculatedItems };
  }

  private calculateShippingCost(subtotal: number): number {
    // Free shipping for orders over $50
    if (subtotal >= 50) {
      return 0;
    }
    
    // Standard shipping cost
    return 19.99;
  }

  private isValidStatusTransition(currentStatus: OrderStatus, newStatus: string): boolean {
    const validTransitions = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: []
    };

    return validTransitions[currentStatus]?.includes(newStatus as OrderStatus) || false;
  }

  private mapToResponseDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      shippingAddress: order.shippingAddress,
      postalCode: order.postalCode,
      city: order.city,
      country: order.country,
      orderItems: order.orderItems || [],
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
} 