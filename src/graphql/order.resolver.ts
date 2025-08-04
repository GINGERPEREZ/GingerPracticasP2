import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { OrderService } from '../services/order.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderResponseDto, OrderSummaryDto } from '../dto/order.dto';

@Resolver(() => OrderResponseDto)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => OrderResponseDto)
  createOrder(@Args('createOrderDto') createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderService.create(createOrderDto);
  }

  @Query(() => [OrderResponseDto])
  orders(@Args('userId', { nullable: true }) userId?: string): Promise<OrderResponseDto[]> {
    if (userId) {
      return this.orderService.findByUser(userId);
    }
    return this.orderService.findAll();
  }

  @Query(() => OrderResponseDto)
  order(@Args('id') id: string): Promise<OrderResponseDto> {
    return this.orderService.findOne(id);
  }

  @Query(() => OrderSummaryDto)
  orderSummary(@Args('id') id: string): Promise<OrderSummaryDto> {
    return this.orderService.getOrderSummary(id);
  }

  @Mutation(() => OrderResponseDto)
  updateOrderStatus(
    @Args('id') id: string,
    @Args('updateOrderStatusDto') updateOrderStatusDto: UpdateOrderStatusDto
  ): Promise<OrderResponseDto> {
    return this.orderService.updateStatus(id, updateOrderStatusDto);
  }

  @Mutation(() => OrderResponseDto)
  checkout(@Args('createOrderDto') createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderService.create(createOrderDto);
  }

  @ResolveField(() => Number)
  totalItems(@Parent() order: OrderResponseDto): number {
    return order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }

  @ResolveField(() => Boolean)
  hasFreeShipping(@Parent() order: OrderResponseDto): boolean {
    return order.shippingCost === 0;
  }
} 