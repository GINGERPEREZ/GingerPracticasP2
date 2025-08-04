import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CustomizationService } from '../services/customization.service';
import { CreateCustomizationDto, UpdateCustomizationDto, CustomizationResponseDto } from '../dto/customization.dto';

@Controller('customizations')
export class CustomizationController {
  constructor(private readonly customizationService: CustomizationService) {}

  @Post()
  create(@Body() createCustomizationDto: CreateCustomizationDto): Promise<CustomizationResponseDto> {
    return this.customizationService.create(createCustomizationDto);
  }

  @Get()
  findAll(@Query('productId') productId?: string): Promise<CustomizationResponseDto[]> {
    if (productId) {
      return this.customizationService.findByProduct(productId);
    }
    return this.customizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CustomizationResponseDto> {
    return this.customizationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomizationDto: UpdateCustomizationDto): Promise<CustomizationResponseDto> {
    return this.customizationService.update(id, updateCustomizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.customizationService.remove(id);
  }
} 