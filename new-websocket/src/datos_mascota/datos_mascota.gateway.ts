import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io'; // Importa Server y Socket de 'socket.io'
import { DatosMascotaService } from './datos_mascota.service';
import { CreateDatosMascotaDto } from './dto/create-datos_mascota.dto';
import { UpdateDatosMascotaDto } from './dto/update-datos_mascota.dto';

// Define el puerto del gateway y las opciones CORS
@WebSocketGateway({
  cors: {
    origin: '*', // Permite conexiones desde cualquier origen (ajustar en producción)
    methods: ['GET', 'POST'],
  },
})
export class DatosMascotaGateway {
  @WebSocketServer()
  server: Server; // Inyecta la instancia del servidor Socket.IO

  private readonly logger = new Logger(DatosMascotaGateway.name);

  constructor(private readonly datosMascotaService: DatosMascotaService) {}

  // ==============================================
  // Manejadores de Eventos para CRUD de DatosMascota
  // ==============================================

  @SubscribeMessage('createDatosMascota') // Evento que el cliente emitirá para crear
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @MessageBody() createDatosMascotaDto: CreateDatosMascotaDto,
    @ConnectedSocket() client: Socket, // Opcional: para responder directamente al cliente que envió el mensaje
  ) {
    this.logger.log(`Received createDatosMascota event from ${client.id} with data: ${JSON.stringify(createDatosMascotaDto)}`);
    try {
      const mascota = await this.datosMascotaService.create(createDatosMascotaDto);
      // Emitir el evento a todos los clientes conectados (o solo al que envió la solicitud)
      this.server.emit('datosMascotaCreated', mascota);
      this.logger.log(`Mascota created and emitted: ${JSON.stringify(mascota)}`);
      return { event: 'createDatosMascotaSuccess', data: mascota }; // Respuesta ACK al cliente
    } catch (error) {
      this.logger.error(`Error creating mascota: ${error.message}`);
      // Emitir un evento de error
      client.emit('datosMascotaError', { event: 'createDatosMascota', message: error.message, details: error.response });
      return { event: 'createDatosMascotaFailure', error: error.message }; // Respuesta ACK con error
    }
  }

  @SubscribeMessage('findAllDatosMascotas') // Evento para obtener todas las mascotas
  async findAll(@ConnectedSocket() client: Socket) {
    this.logger.log(`Received findAllDatosMascotas event from ${client.id}`);
    try {
      const mascotas = await this.datosMascotaService.findAll();
      // Emitir las mascotas de vuelta al cliente que las solicitó
      client.emit('allDatosMascotas', mascotas);
      this.logger.log(`Emitted all mascotas to ${client.id}`);
      return { event: 'findAllDatosMascotasSuccess', data: mascotas }; // Respuesta ACK
    } catch (error) {
      this.logger.error(`Error finding all mascotas: ${error.message}`);
      client.emit('datosMascotaError', { event: 'findAllDatosMascotas', message: error.message, details: error.response });
      return { event: 'findAllDatosMascotasFailure', error: error.message }; // Respuesta ACK con error
    }
  }

  @SubscribeMessage('findOneDatosMascota') // Evento para obtener una mascota por ID
  @UsePipes(new ValidationPipe({ transform: true })) // Asegura que el ID se transforme a número
  async findOne(
    @MessageBody('id') id: number, // Extrae el 'id' del cuerpo del mensaje
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received findOneDatosMascota event from ${client.id} with id: ${id}`);
    try {
      const mascota = await this.datosMascotaService.findOne(id);
      client.emit('datosMascotaFound', mascota);
      this.logger.log(`Mascota found and emitted: ${JSON.stringify(mascota)}`);
      return { event: 'findOneDatosMascotaSuccess', data: mascota }; // Respuesta ACK
    } catch (error) {
      this.logger.error(`Error finding mascota by id ${id}: ${error.message}`);
      client.emit('datosMascotaError', { event: 'findOneDatosMascota', message: error.message, details: error.response });
      return { event: 'findOneDatosMascotaFailure', error: error.message }; // Respuesta ACK con error
    }
  }

  @SubscribeMessage('updateDatosMascota') // Evento para actualizar una mascota
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @MessageBody() updateDatosMascotaDto: UpdateDatosMascotaDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received updateDatosMascota event from ${client.id} with data: ${JSON.stringify(updateDatosMascotaDto)}`);
    try {
      const updatedMascota = await this.datosMascotaService.update(updateDatosMascotaDto);
      this.server.emit('datosMascotaUpdated', updatedMascota);
      this.logger.log(`Mascota updated and emitted: ${JSON.stringify(updatedMascota)}`);
      return { event: 'updateDatosMascotaSuccess', data: updatedMascota }; // Respuesta ACK
    } catch (error) {
      this.logger.error(`Error updating mascota: ${error.message}`);
      client.emit('datosMascotaError', { event: 'updateDatosMascota', message: error.message, details: error.response });
      return { event: 'updateDatosMascotaFailure', error: error.message }; // Respuesta ACK con error
    }
  }

  @SubscribeMessage('removeDatosMascota') // Evento para eliminar una mascota
  @UsePipes(new ValidationPipe({ transform: true }))
  async remove(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received removeDatosMascota event from ${client.id} with id: ${id}`);
    try {
      const removed = await this.datosMascotaService.remove(id);
      if (removed) {
        this.server.emit('datosMascotaRemoved', { id: id, success: true });
        this.logger.log(`Mascota with id ${id} removed and emitted.`);
        return { event: 'removeDatosMascotaSuccess', data: { id: id, success: true } }; // Respuesta ACK
      }
    } catch (error) {
      this.logger.error(`Error removing mascota by id ${id}: ${error.message}`);
      client.emit('datosMascotaError', { event: 'removeDatosMascota', message: error.message, details: error.response });
      return { event: 'removeDatosMascotaFailure', error: error.message }; // Respuesta ACK con error
    }
  }

  // ==============================================
  // Eventos de Conexión y Desconexión (Opcional)
  // ==============================================

  afterInit(server: Server) {
    this.logger.log('DatosMascota Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
