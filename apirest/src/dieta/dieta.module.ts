import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DietaService } from './dieta.service';
import { DietaController } from './dieta.controller';
import { Dieta } from './entities/dieta.entity';
import { DatosMascota } from '../datos_mascota/entities/datos_mascota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dieta, DatosMascota])],
  controllers: [DietaController],
  providers: [DietaService],
})
export class DietaModule {}
