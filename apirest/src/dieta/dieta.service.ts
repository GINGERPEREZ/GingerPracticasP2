import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dieta } from './entities/dieta.entity';
import { CreateDietaDto } from './dto/create-dieta.dto';
import { UpdateDietaDto } from './dto/update-dieta.dto';
import { DatosMascota } from '../datos_mascota/entities/datos_mascota.entity';

@Injectable()
export class DietaService {
  constructor(
    @InjectRepository(Dieta)
    private readonly dietaRepo: Repository<Dieta>,

    @InjectRepository(DatosMascota)
    private readonly mascotaRepo: Repository<DatosMascota>,
  ) {}

  async create(createDto: CreateDietaDto): Promise<Dieta> {
    const mascota = await this.mascotaRepo.findOneBy({ id: createDto.mascota_id });
    if (!mascota) {
      throw new NotFoundException(`Mascota con ID ${createDto.mascota_id} no encontrada`);
    }

    const dieta = this.dietaRepo.create({
      ...createDto,
      mascota,
    });

    return await this.dietaRepo.save(dieta);
  }

  async findAll(): Promise<Dieta[]> {
    return await this.dietaRepo.find({ relations: ['mascota'] });
  }

  async findOne(id: number): Promise<Dieta> {
    const dieta = await this.dietaRepo.findOne({
      where: { id },
      relations: ['mascota'],
    });
    if (!dieta) {
      throw new NotFoundException(`Dieta con ID ${id} no encontrada`);
    }
    return dieta;
  }

  async update(id: number, updateDto: UpdateDietaDto): Promise<Dieta> {
    const dieta = await this.dietaRepo.findOneBy({ id });
    if (!dieta) {
      throw new NotFoundException(`Dieta con ID ${id} no encontrada`);
    }

    if (updateDto.mascota_id) {
      const mascota = await this.mascotaRepo.findOneBy({ id: updateDto.mascota_id });
      if (!mascota) {
        throw new NotFoundException(`Mascota con ID ${updateDto.mascota_id} no encontrada`);
      }
      dieta.mascota = mascota;
    }

    Object.assign(dieta, updateDto);
    return await this.dietaRepo.save(dieta);
  }

  async remove(id: number): Promise<void> {
    const result = await this.dietaRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Dieta con ID ${id} no encontrada`);
    }
  }
}
