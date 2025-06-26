import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatosMascota } from './entities/datos_mascota.entity';
import { CreateDatosMascotaDto } from './dto/create-datos_mascota.dto';
import { UpdateDatosMascotaDto } from './dto/update-datos_mascota.dto';

@Injectable()
export class DatosMascotaService {
  constructor(
    @InjectRepository(DatosMascota)
    private readonly datosMascotaRepo: Repository<DatosMascota>,
  ) {}

  async create(createDto: CreateDatosMascotaDto): Promise<DatosMascota> {
    const mascota = this.datosMascotaRepo.create(createDto);
    return await this.datosMascotaRepo.save(mascota);
  }

  async findAll(): Promise<DatosMascota[]> {
    return await this.datosMascotaRepo.find();
  }

  async findOne(id: number): Promise<DatosMascota> {
    const mascota = await this.datosMascotaRepo.findOneBy({ id });
    if (!mascota) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    }
    return mascota;
  }

  async update(id: number, updateDto: UpdateDatosMascotaDto): Promise<DatosMascota> {
    const mascota = await this.datosMascotaRepo.findOneBy({ id });
    if (!mascota) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    }
    const updated = Object.assign(mascota, updateDto);
    return await this.datosMascotaRepo.save(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.datosMascotaRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    }
  }
}
