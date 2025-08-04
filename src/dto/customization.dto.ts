import { IsString, IsNumber, IsOptional, IsUrl } from 'class-validator';
// --- GraphQL Decorators ---
import { ObjectType, InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateCustomizationDto {
  @Field()
  @IsString()
  color: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  customText?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  customImageUrl?: string;

  @Field(() => Int)
  @IsNumber()
  quantity: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  customizationPrice?: number;

  @Field()
  @IsString()
  productId: string;
}

@InputType()
export class UpdateCustomizationDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  color?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  customText?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  customImageUrl?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  customizationPrice?: number;
}

@ObjectType()
export class CustomizationResponseDto {
  @Field()
  id: string;

  @Field()
  color: string;

  @Field({ nullable: true })
  customText?: string;

  @Field({ nullable: true })
  customImageUrl?: string;

  @Field()
  quantity: number;

  @Field()
  customizationPrice: number;

  @Field()
  productId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
