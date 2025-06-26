import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialMedico } from './entities/historial_medico.entity';
import { CreateHistorialMedicoDto } from './dto/create-historial_medico.dto';
import { UpdateHistorialMedicoDto } from './dto/update-historial_medico.dto';
import { DatosMascota } from '../datos_mascota/entities/datos_mascota.entity';

@Injectable()
export class HistorialMedicoService {
  constructor(
    @InjectRepository(HistorialMedico)
    private readonly historialRepo: Repository<HistorialMedico>,

    @InjectRepository(DatosMascota)
    private readonly mascotaRepo: Repository<DatosMascota>,
  ) {}

  async create(createDto: CreateHistorialMedicoDto): Promise<HistorialMedico> {
    // Verificar que la mascota exista
    const mascota = await this.mascotaRepo.findOneBy({ id: createDto.mascota_id });
    if (!mascota) {
      throw new NotFoundException(`Mascota con ID ${createDto.mascota_id} no encontrada`);
    }

    const historial = this.historialRepo.create({
      ...createDto,
      mascota,
    });

    return await this.historialRepo.save(historial);
  }

  async findAll(): Promise<HistorialMedico[]> {
    return await this.historialRepo.find({ relations: ['mascota'] });
  }

  async findOne(id: number): Promise<HistorialMedico> {
    const historial = await this.historialRepo.findOne({
      where: { id },
      relations: ['mascota'],
    });
    if (!historial) {
      throw new NotFoundException(`Historial médico con ID ${id} no encontrado`);
    }
    return historial;
  }

  async update(id: number, updateDto: UpdateHistorialMedicoDto): Promise<HistorialMedico> {
    const historial = await this.historialRepo.findOneBy({ id });
    if (!historial) {
      throw new NotFoundException(`Historial médico con ID ${id} no encontrado`);
    }

    // Si actualizan la mascota, verificar que exista
    if (updateDto.mascota_id) {
      const mascota = await this.mascotaRepo.findOneBy({ id: updateDto.mascota_id });
      if (!mascota) {
        throw new NotFoundException(`Mascota con ID ${updateDto.mascota_id} no encontrada`);
      }
      historial.mascota = mascota;
    }

    Object.assign(historial, updateDto);
    return await this.historialRepo.save(historial);
  }

  async remove(id: number): Promise<void> {
    const result = await this.historialRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Historial médico con ID ${id} no encontrado`);
    }
  }
}
