import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io'; // Importa Server y Socket de 'socket.io'
import { HistorialMedicoService } from './historial_medico.service';
import { CreateHistorialMedicoDto } from './dto/create-historial_medico.dto';
import { UpdateHistorialMedicoDto } from './dto/update-historial_medico.dto';

// Define el puerto del gateway y las opciones CORS
@WebSocketGateway({
  cors: {
    origin: '*', // Permite conexiones desde cualquier origen (ajustar en producción)
    methods: ['GET', 'POST'],
  },
})
export class HistorialMedicoGateway {
  @WebSocketServer()
  server: Server; // Inyecta la instancia del servidor Socket.IO

  private readonly logger = new Logger(HistorialMedicoGateway.name);

  constructor(private readonly historialMedicoService: HistorialMedicoService) {}

  // ==============================================
  // Manejadores de Eventos para CRUD de Historial Médico
  // ==============================================

  @SubscribeMessage('createHistorialMedico') // Evento que el cliente emitirá para crear
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @MessageBody() createHistorialMedicoDto: CreateHistorialMedicoDto,
    @ConnectedSocket() client: Socket, // Opcional: para responder directamente al cliente que envió el mensaje
  ) {
    this.logger.log(`Received createHistorialMedico event from ${client.id} with data: ${JSON.stringify(createHistorialMedicoDto)}`);
    try {
      const historial = await this.historialMedicoService.create(createHistorialMedicoDto);
      // Emitir el evento a todos los clientes conectados (o solo al que envió la solicitud)
      this.server.emit('historialMedicoCreated', historial);
      this.logger.log(`Medical History created and emitted: ${JSON.stringify(historial)}`);
      return { event: 'createHistorialMedicoSuccess', data: historial }; // Respuesta ACK al cliente
    } catch (error) {
      this.logger.error(`Error creating medical history: ${error.message}`);
      // Emitir un evento de error
      client.emit('historialMedicoError', { event: 'createHistorialMedico', message: error.message, details: error.response });
      return { event: 'createHistorialMedicoFailure', error: error.message }; // Respuesta ACK con error
    }
  }

  @SubscribeMessage('findAllHistorialesMedicos') // Evento para obtener todos los historiales médicos
  async findAll(@ConnectedSocket() client: Socket) {
    this.logger.log(`Received findAllHistorialesMedicos event from ${client.id}`);
    try {
      const historiales = await this.historialMedicoService.findAll();
      // Emitir los historiales médicos de vuelta al cliente que los solicitó
      client.emit('allHistorialesMedicos', historiales);
      this.logger.log(`Emitted all medical histories to ${client.id}`);
      return { event: 'findAllHistorialesMedicosSuccess', data: historiales }; // Respuesta ACK
    } catch (error) {
      this.logger.error(`Error finding all medical histories: ${error.message}`);
      client.emit('historialMedicoError', { event: 'findAllHistorialesMedicos', message: error.message, details: error.response });
      return { event: 'findAllHistorialesMedicosFailure', error: error.message }; // Respuesta ACK con error
    }
  }

  @SubscribeMessage('findOneHistorialMedico') // Evento para obtener un historial médico por ID
  @UsePipes(new ValidationPipe({ transform: true })) // Asegura que el ID se transforme a número
  async findOne(
    @MessageBody('id') id: number, // Extrae el 'id' del cuerpo del mensaje
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received findOneHistorialMedico event from ${client.id} with id: ${id}`);
    try {
      const historial = await this.historialMedicoService.findOne(id);
      client.emit('historialMedicoFound', historial);
      this.logger.log(`Medical History found and emitted: ${JSON.stringify(historial)}`);
      return { event: 'findOneHistorialMedicoSuccess', data: historial }; // Respuesta ACK
    } catch (error) {
      this.logger.error(`Error finding medical history by id ${id}: ${error.message}`);
      client.emit('historialMedicoError', { event: 'findOneHistorialMedico', message: error.message, details: error.response });
      return { event: 'findOneHistorialMedicoFailure', error: error.message }; // Respuesta ACK con error
    }
  }

  @SubscribeMessage('updateHistorialMedico') // Evento para actualizar un historial médico
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @MessageBody() updateHistorialMedicoDto: UpdateHistorialMedicoDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received updateHistorialMedico event from ${client.id} with data: ${JSON.stringify(updateHistorialMedicoDto)}`);
    try {
      const updatedHistorial = await this.historialMedicoService.update(updateHistorialMedicoDto);
      this.server.emit('historialMedicoUpdated', updatedHistorial);
      this.logger.log(`Medical History updated and emitted: ${JSON.stringify(updatedHistorial)}`);
      return { event: 'updateHistorialMedicoSuccess', data: updatedHistorial }; // Respuesta ACK
    } catch (error) {
      this.logger.error(`Error updating medical history: ${error.message}`);
      client.emit('historialMedicoError', { event: 'updateHistorialMedico', message: error.message, details: error.response });
      return { event: 'updateHistorialMedicoFailure', error: error.message }; // Respuesta ACK con error
    }
  }

  @SubscribeMessage('removeHistorialMedico') // Evento para eliminar un historial médico
  @UsePipes(new ValidationPipe({ transform: true }))
  async remove(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received removeHistorialMedico event from ${client.id} with id: ${id}`);
    try {
      const removed = await this.historialMedicoService.remove(id);
      if (removed) {
        this.server.emit('historialMedicoRemoved', { id: id, success: true });
        this.logger.log(`Medical History with id ${id} removed and emitted.`);
        return { event: 'removeHistorialMedicoSuccess', data: { id: id, success: true } }; // Respuesta ACK
      }
    } catch (error) {
      this.logger.error(`Error removing medical history by id ${id}: ${error.message}`);
      client.emit('historialMedicoError', { event: 'removeHistorialMedico', message: error.message, details: error.response });
      return { event: 'removeHistorialMedicoFailure', error: error.message }; // Respuesta ACK con error
    }
  }

  // ==============================================
  // Eventos de Conexión y Desconexión (Opcional)
  // ==============================================

  afterInit(server: Server) {
    this.logger.log('Medical History Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
