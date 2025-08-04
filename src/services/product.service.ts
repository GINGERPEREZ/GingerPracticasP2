import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductCategory } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from '../dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);
    return this.mapToResponseDto(savedProduct);
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
    return products.map(product => this.mapToResponseDto(product));
  }

  async findByCategory(category: ProductCategory): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.find({
      where: { category, isActive: true },
      order: { createdAt: 'DESC' }
    });
    return products.map(product => this.mapToResponseDto(product));
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true }
    });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return this.mapToResponseDto(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);
    return this.mapToResponseDto(updatedProduct);
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    product.isActive = false;
    await this.productRepository.save(product);
  }

  async getProductPrice(id: string): Promise<number> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
      select: ['basePrice']
    });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product.basePrice;
  }

  private mapToResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      category: product.category,
      imageUrl: product.imageUrl,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
} 