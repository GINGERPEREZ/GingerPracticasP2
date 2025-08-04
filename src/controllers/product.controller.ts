import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from '../dto/product.dto';
import { ProductCategory } from '../entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query('category') category?: ProductCategory): Promise<ProductResponseDto[]> {
    if (category) {
      return this.productService.findByCategory(category);
    }
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
} 