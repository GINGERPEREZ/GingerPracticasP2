import { CreateDatosMascotaDto } from './create-datos_mascota.dto';
import { IsInt } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateDatosMascotaDto extends PartialType(CreateDatosMascotaDto) {
  @IsInt()
  id: number;
}
