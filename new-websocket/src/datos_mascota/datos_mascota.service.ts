import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatosMascota } from './entities/datos_mascota.entity';
import { CreateDatosMascotaDto } from './dto/create-datos_mascota.dto'; // Usamos el DTO de WebSockets
import { UpdateDatosMascotaDto } from './dto/update-datos_mascota.dto'; // Usamos el DTO de WebSockets
import { HistorialMedico } from '../historial_medico/entities/historial_medico.entity'; // Necesario para cargar la relación
import { Dieta } from '../dieta/entities/dieta.entity'; // Necesario para cargar la relación

@Injectable()
export class DatosMascotaService {
  constructor(
    @InjectRepository(DatosMascota)
    private readonly datosMascotaRepository: Repository<DatosMascota>,
    @InjectRepository(HistorialMedico) // Inyectamos el repositorio de HistorialMedico para cargar la relación
    private readonly historialMedicoRepository: Repository<HistorialMedico>,
    @InjectRepository(Dieta) // Inyectamos el repositorio de Dieta para cargar la relación
    private readonly dietaRepository: Repository<Dieta>,
  ) {}

  /**
   * Crea un nuevo registro de mascota.
   * @param createDatosMascotaDto Los datos para crear la mascota.
   * @returns La mascota creada.
   */
  async create(createDatosMascotaDto: CreateDatosMascotaDto): Promise<DatosMascota> {
    const newMascota = this.datosMascotaRepository.create(createDatosMascotaDto);
    return this.datosMascotaRepository.save(newMascota);
  }

  /**
   * Encuentra todas las mascotas.
   * @returns Un arreglo de mascotas.
   */
  async findAll(): Promise<DatosMascota[]> {
    // Carga las relaciones 'historiales' y 'dietas' para que estén disponibles
    return this.datosMascotaRepository.find({ relations: ['historiales', 'dietas'] });
  }

  /**
   * Encuentra una mascota por su ID.
   * @param id El ID de la mascota.
   * @returns La mascota encontrada.
   * @throws NotFoundException si la mascota no existe.
   */
  async findOne(id: number): Promise<DatosMascota> {
    const mascota = await this.datosMascotaRepository.findOne({
      where: { id },
      relations: ['historiales', 'dietas'], // Carga los historiales médicos y dietas relacionados
    });
    if (!mascota) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada.`);
    }
    return mascota;
  }

  /**
   * Actualiza un registro de mascota existente.
   * @param updateDatosMascotaDto Los datos para actualizar la mascota, incluyendo su ID.
   * @returns La mascota actualizada.
   * @throws NotFoundException si la mascota no existe.
   */
  async update(updateDatosMascotaDto: UpdateDatosMascotaDto): Promise<DatosMascota> {
    const { id, ...rest } = updateDatosMascotaDto;

    const mascota = await this.datosMascotaRepository.preload({
      id: id,
      ...rest,
    });

    if (!mascota) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada.`);
    }

    return this.datosMascotaRepository.save(mascota);
  }

  /**
   * Elimina un registro de mascota por su ID.
   * @param id El ID de la mascota a eliminar.
   * @returns Verdadero si se eliminó exitosamente.
   * @throws NotFoundException si la mascota no existe.
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.datosMascotaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada.`);
    }
    return true;
  }
}
