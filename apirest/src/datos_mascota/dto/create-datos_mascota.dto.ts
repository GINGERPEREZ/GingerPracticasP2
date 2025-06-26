import { IsString, IsInt, IsDateString, Length } from 'class-validator';

export class CreateDatosMascotaDto {
  @IsString()
  @Length(1, 100)
  nombre: string;

  @IsString()
  @Length(1, 50)
  especie: string;

  @IsString()
  @Length(1, 50)
  raza: string;

  @IsInt()
  edad: number;

  @IsString()
  @Length(1, 10)
  sexo: string;

  @IsString()
  @Length(1, 50)
  color: string;

  @IsDateString()
  fecha_ingreso: Date;
}
