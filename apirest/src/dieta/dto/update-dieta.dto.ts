import { PartialType } from '@nestjs/mapped-types';
import { CreateDietaDto } from './create-dieta.dto';
import { IsInt } from 'class-validator';

export class UpdateDietaDto extends PartialType(CreateDietaDto) {
  @IsInt()
  id: number;
}
