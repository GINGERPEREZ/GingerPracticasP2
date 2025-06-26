import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialMedicoService } from './historial_medico.service';
import { HistorialMedicoController } from './historial_medico.controller';
import { HistorialMedico } from './entities/historial_medico.entity';
import { DatosMascota } from '../datos_mascota/entities/datos_mascota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialMedico, DatosMascota])],
  controllers: [HistorialMedicoController],
  providers: [HistorialMedicoService],
})
export class HistorialMedicoModule {}
