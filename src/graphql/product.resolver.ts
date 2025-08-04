import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from '../dto/product.dto';
import { ProductCategory } from '../entities/product.entity';

@Resolver(() => ProductResponseDto)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => ProductResponseDto)
  createProduct(@Args('createProductDto') createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    return this.productService.create(createProductDto);
  }

  @Query(() => [ProductResponseDto])
  products(@Args('category', { nullable: true }) category?: ProductCategory): Promise<ProductResponseDto[]> {
    if (category) {
      return this.productService.findByCategory(category);
    }
    return this.productService.findAll();
  }

  @Query(() => ProductResponseDto)
  product(@Args('id') id: string): Promise<ProductResponseDto> {
    return this.productService.findOne(id);
  }

  @Mutation(() => ProductResponseDto)
  updateProduct(
    @Args('id') id: string,
    @Args('updateProductDto') updateProductDto: UpdateProductDto
  ): Promise<ProductResponseDto> {
    return this.productService.update(id, updateProductDto);
  }

  @Mutation(() => Boolean)
  removeProduct(@Args('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }

  @Query(() => Number)
  productPrice(@Args('id') id: string): Promise<number> {
    return this.productService.getProductPrice(id);
  }
} 