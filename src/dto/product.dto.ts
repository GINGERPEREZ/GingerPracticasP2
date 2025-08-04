import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsUrl } from 'class-validator';
import { ProductCategory } from '../entities/product.entity';
// --- GraphQL Decorators ---
import { ObjectType, InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProductDto {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsNumber()
  basePrice: number;

  @Field(() => String)
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @Field()
  @IsUrl()
  imageUrl: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@InputType()
export class UpdateProductDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  basePrice?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@ObjectType()
export class ProductResponseDto {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  basePrice: number;

  @Field(() => String)
  category: ProductCategory;

  @Field()
  imageUrl: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
