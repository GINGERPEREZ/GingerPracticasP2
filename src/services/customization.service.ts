import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customization } from '../entities/customization.entity';
import { Product } from '../entities/product.entity';
import { CreateCustomizationDto, UpdateCustomizationDto, CustomizationResponseDto } from '../dto/customization.dto';

@Injectable()
export class CustomizationService {
  constructor(
    @InjectRepository(Customization)
    private customizationRepository: Repository<Customization>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createCustomizationDto: CreateCustomizationDto): Promise<CustomizationResponseDto> {
    // Verify product exists
    const product = await this.productRepository.findOne({
      where: { id: createCustomizationDto.productId, isActive: true }
    });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${createCustomizationDto.productId} not found`);
    }

    // Calculate customization price based on features
    const customizationPrice = this.calculateCustomizationPrice(createCustomizationDto);

    const customization = this.customizationRepository.create({
      ...createCustomizationDto,
      customizationPrice
    });
    
    const savedCustomization = await this.customizationRepository.save(customization);
    return this.mapToResponseDto(savedCustomization);
  }

  async findAll(): Promise<CustomizationResponseDto[]> {
    const customizations = await this.customizationRepository.find({
      order: { createdAt: 'DESC' }
    });
    return customizations.map(customization => this.mapToResponseDto(customization));
  }

  async findOne(id: string): Promise<CustomizationResponseDto> {
    const customization = await this.customizationRepository.findOne({
      where: { id }
    });
    
    if (!customization) {
      throw new NotFoundException(`Customization with ID ${id} not found`);
    }
    
    return this.mapToResponseDto(customization);
  }

  async findByProduct(productId: string): Promise<CustomizationResponseDto[]> {
    const customizations = await this.customizationRepository.find({
      where: { productId },
      order: { createdAt: 'DESC' }
    });
    return customizations.map(customization => this.mapToResponseDto(customization));
  }

  async update(id: string, updateCustomizationDto: UpdateCustomizationDto): Promise<CustomizationResponseDto> {
    const customization = await this.customizationRepository.findOne({ where: { id } });
    
    if (!customization) {
      throw new NotFoundException(`Customization with ID ${id} not found`);
    }
    
    // Recalculate price if customization features changed
    if (updateCustomizationDto.color || updateCustomizationDto.customText || updateCustomizationDto.customImageUrl) {
      const updatedData = { ...customization, ...updateCustomizationDto };
      updateCustomizationDto.customizationPrice = this.calculateCustomizationPrice(updatedData);
    }
    
    Object.assign(customization, updateCustomizationDto);
    const updatedCustomization = await this.customizationRepository.save(customization);
    return this.mapToResponseDto(updatedCustomization);
  }

  async remove(id: string): Promise<void> {
    const customization = await this.customizationRepository.findOne({ where: { id } });
    
    if (!customization) {
      throw new NotFoundException(`Customization with ID ${id} not found`);
    }
    
    await this.customizationRepository.remove(customization);
  }

  private calculateCustomizationPrice(customization: any): number {
    let price = 0;
    
    // Base price for customization
    price += 5.00;
    
    // Additional cost for custom text
    if (customization.customText && customization.customText.trim()) {
      price += 2.50;
    }
    
    // Additional cost for custom image
    if (customization.customImageUrl) {
      price += 3.00;
    }
    
    // Color variations might have different costs
    if (customization.color === 'black' || customization.color === 'white') {
      price += 0.50;
    }
    
    return price;
  }

  private mapToResponseDto(customization: Customization): CustomizationResponseDto {
    return {
      id: customization.id,
      color: customization.color,
      customText: customization.customText,
      customImageUrl: customization.customImageUrl,
      quantity: customization.quantity,
      customizationPrice: customization.customizationPrice,
      productId: customization.productId,
      createdAt: customization.createdAt,
      updatedAt: customization.updatedAt,
    };
  }
} 