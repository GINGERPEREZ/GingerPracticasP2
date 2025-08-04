import { IsString, IsNumber, IsEnum, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../entities/order.entity';

// --- GraphQL Decorators ---
import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
@InputType('OrderItemInput')
export class OrderItemDto {
  @Field()
  @IsString()
  productId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  customizationId?: string;

  @Field()
  @IsNumber()
  quantity: number;

  @Field()
  @IsNumber()
  price: number;
}

@InputType()
export class CreateOrderDto {
  @Field()
  @IsString()
  userId: string;

  @Field(() => String)
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @Field()
  @IsString()
  shippingAddress: string;

  @Field()
  @IsString()
  postalCode: string;

  @Field()
  @IsString()
  city: string;

  @Field()
  @IsString()
  country: string;

  @Field(() => [OrderItemDto])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}

@InputType()
export class UpdateOrderStatusDto {
  @Field()
  @IsString()
  status: string;
}

@ObjectType()
export class OrderSummaryDto {
  @Field()
  orderId: string;

  @Field()
  status: string;

  @Field()
  subtotal: number;

  @Field()
  shippingCost: number;

  @Field()
  total: number;

  @Field()
  itemCount: number;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class OrderResponseDto {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  status: string;

  @Field(() => String)
  paymentMethod: PaymentMethod;

  @Field()
  subtotal: number;

  @Field()
  shippingCost: number;

  @Field()
  total: number;

  @Field()
  shippingAddress: string;

  @Field()
  postalCode: string;

  @Field()
  city: string;

  @Field()
  country: string;

  @Field(() => [OrderItemDto])
  orderItems: OrderItemDto[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}