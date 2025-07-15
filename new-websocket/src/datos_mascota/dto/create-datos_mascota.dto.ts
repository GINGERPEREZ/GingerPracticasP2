import { IsNotEmpty, IsString, IsInt, IsDate, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDatosMascotaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  especie: string;

  @IsString()
  @IsNotEmpty()
  raza: string;

  @IsInt()
  @IsNotEmpty()
  @Min(0) // Assuming age cannot be negative
  edad: number;

  @IsString()
  @IsNotEmpty()
  sexo: string; // Consider using an Enum for 'sexo' for better type safety

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date) // Important for transforming date strings to Date objects
  fecha_ingreso: Date;
}
