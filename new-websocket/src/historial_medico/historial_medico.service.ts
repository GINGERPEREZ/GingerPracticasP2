import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialMedico } from './entities/historial_medico.entity';
import { CreateHistorialMedicoDto } from './dto/create-historial_medico.dto'; // Usamos el DTO de WebSockets
import { UpdateHistorialMedicoDto } from './dto/update-historial_medico.dto'; // Usamos el DTO de WebSockets
import { DatosMascota } from '../datos_mascota/entities/datos_mascota.entity'; // Importa la entidad DatosMascota

@Injectable()
export class HistorialMedicoService {
  constructor(
    @InjectRepository(HistorialMedico)
    private readonly historialMedicoRepository: Repository<HistorialMedico>,
    @InjectRepository(DatosMascota) // Inyectamos el repositorio de DatosMascota para manejar la relación
    private readonly datosMascotaRepository: Repository<DatosMascota>,
  ) {}

  /**
   * Crea un nuevo registro de historial médico.
   * @param createHistorialMedicoDto Los datos para crear el historial.
   * @returns El historial médico creado.
   */
  async create(createHistorialMedicoDto: CreateHistorialMedicoDto): Promise<HistorialMedico> {
    const { mascotaId, ...rest } = createHistorialMedicoDto;

    // Verificar si la mascota existe usando findOneBy
    const mascota = await this.datosMascotaRepository.findOneBy({ id: mascotaId });
    if (!mascota) {
      throw new NotFoundException(`Mascota con ID ${mascotaId} no encontrada.`);
    }

    const newHistorial = this.historialMedicoRepository.create({
      ...rest,
      mascota: mascota, // Asignamos el objeto mascota completo
    });

    return this.historialMedicoRepository.save(newHistorial);
  }

  /**
   * Encuentra todos los historiales médicos.
   * @returns Un arreglo de historiales médicos.
   */
  async findAll(): Promise<HistorialMedico[]> {
    return this.historialMedicoRepository.find({ relations: ['mascota'] }); // Carga la relación 'mascota'
  }

  /**
   * Encuentra un historial médico por su ID.
   * @param id El ID del historial médico.
   * @returns El historial médico encontrado.
   * @throws NotFoundException si el historial no existe.
   */
  async findOne(id: number): Promise<HistorialMedico> {
    const historial = await this.historialMedicoRepository.findOne({
      where: { id },
      relations: ['mascota'], // Carga la relación 'mascota'
    });
    if (!historial) {
      throw new NotFoundException(`Historial Médico con ID ${id} no encontrado.`);
    }
    return historial;
  }

  /**
   * Actualiza un registro de historial médico existente.
   * @param updateHistorialMedicoDto Los datos para actualizar el historial, incluyendo su ID.
   * @returns El historial médico actualizado.
   * @throws NotFoundException si el historial no existe.
   */
  async update(updateHistorialMedicoDto: UpdateHistorialMedicoDto): Promise<HistorialMedico> {
    const { id, mascotaId, ...rest } = updateHistorialMedicoDto;

    const historial = await this.historialMedicoRepository.preload({
      id: id,
      ...rest,
    });

    if (!historial) {
      throw new NotFoundException(`Historial Médico con ID ${id} no encontrado.`);
    }

    // Si se proporciona un nuevo mascotaId, buscar y asignar la nueva mascota
    if (mascotaId) {
      const newMascota = await this.datosMascotaRepository.findOneBy({ id: mascotaId }); // Usamos findOneBy
      if (!newMascota) {
        throw new NotFoundException(`Nueva mascota con ID ${mascotaId} no encontrada.`);
      }
      historial.mascota = newMascota;
    }

    return this.historialMedicoRepository.save(historial);
  }

  /**
   * Elimina un registro de historial médico por su ID.
   * @param id El ID del historial médico a eliminar.
   * @returns Verdadero si se eliminó exitosamente.
   * @throws NotFoundException si el historial no existe.
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.historialMedicoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Historial Médico con ID ${id} no encontrado.`);
    }
    return true;
  }
}
