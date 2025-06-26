import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatosMascotaService } from './datos_mascota.service';
import { DatosMascotaController } from './datos_mascota.controller';
import { DatosMascota } from './entities/datos_mascota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DatosMascota])],
  controllers: [DatosMascotaController],
  providers: [DatosMascotaService],
})
export class DatosMascotaModule {}
