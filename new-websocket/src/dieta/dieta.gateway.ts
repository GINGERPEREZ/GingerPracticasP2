import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io'; // Importa Server y Socket de 'socket.io'
import { DietaService } from './dieta.service';
import { CreateDietaDto } from './dto/create-dieta.dto';
import { UpdateDietaDto } from './dto/update-dieta.dto';

// Define el puerto del gateway y las opciones CORS
@WebSocketGateway({
  cors: {
    origin: '*', // Permite conexiones desde cualquier origen (ajustar en producción)
    methods: ['GET', 'POST'],
  },
})
export class DietaGateway {
  @WebSocketServer()
  server: Server; // Inyecta la instancia del servidor Socket.IO

  private readonly logger = new Logger(DietaGateway.name);

  constructor(private readonly dietaService: DietaService) {}

  // ==============================================
  // Manejadores de Eventos para CRUD de Dieta
  // ==============================================

  @SubscribeMessage('createDieta') // Evento que el cliente emitirá para crear
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @MessageBody() createDietaDto: CreateDietaDto,
    @ConnectedSocket() client: Socket, // Opcional: para responder directamente al cliente que envió el mensaje
  ) {
    this.logger.log(`Received createDieta event from ${client.id} with data: ${JSON.stringify(createDietaDto)}`);
    try {
      const dieta = await this.dietaService.create(createDietaDto);
      // Emitir el evento a todos los clientes conectados
      this.server.emit('dietaCreated', dieta);
      // O responder solo al cliente que envió la solicitud
      // client.emit('createDietaSuccess', dieta);
      this.logger.log(`Dieta created and emitted: ${JSON.stringify(dieta)}`);
      return { event: 'createDietaSuccess', data: dieta }; // Respuesta ACK al cliente
    } catch (error) {
      this.logger.error(`Error creating dieta: ${error.message}`);
      // Emitir un evento de error
      client.emit('dietaError', { event: 'createDieta', message: error.message, details: error.response });
      return { event: 'createDietaFailure', error: error.message }; // Respuesta ACK con error
    }
  }

  @SubscribeMessage('findAllDietas') // Evento para obtener todas las dietas
  async findAll(@ConnectedSocket() client: Socket) {
    this.logger.log(`Received findAllDietas event from ${client.id}`);
    try {
      const dietas = await this.dietaService.findAll();
      // Emitir las dietas de vuelta al cliente que las solicitó
      client.emit('allDietas', dietas);
      this.logger.log(`Emitted all dietas to ${client.id}`);
      return { event: 'findAllDietasSuccess', data: dietas }; // Respuesta ACK
    } catch (error) {
      this.logger.error(`Error finding all dietas: ${error.message}`);
      client.emit('dietaError', { event: 'findAllDietas', message: error.message, details: error.response });
      return { event: 'findAllDietasFailure', error: error.message }; // Respuesta ACK con error
    }
  }

  @SubscribeMessage('findOneDieta') // Evento para obtener una dieta por ID
  @UsePipes(new ValidationPipe({ transform: true })) // Asegura que el ID se transforme a número
  async findOne(
    @MessageBody('id') id: number, // Extrae el 'id' del cuerpo del mensaje
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received findOneDieta event from ${client.id} with id: ${id}`);
    try {
      const dieta = await this.dietaService.findOne(id);
      client.emit('dietaFound', dieta);
      this.logger.log(`Dieta found and emitted: ${JSON.stringify(dieta)}`);
      return { event: 'findOneDietaSuccess', data: dieta }; // Respuesta ACK
    } catch (error) {
      this.logger.error(`Error finding dieta by id ${id}: ${error.message}`);
      client.emit('dietaError', { event: 'findOneDieta', message: error.message, details: error.response });
      return { event: 'findOneDietaFailure', error: error.message }; // Respuesta ACK con error
    }
  }

  @SubscribeMessage('updateDieta') // Evento para actualizar una dieta
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @MessageBody() updateDietaDto: UpdateDietaDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received updateDieta event from ${client.id} with data: ${JSON.stringify(updateDietaDto)}`);
    try {
      const updatedDieta = await this.dietaService.update(updateDietaDto);
      this.server.emit('dietaUpdated', updatedDieta);
      this.logger.log(`Dieta updated and emitted: ${JSON.stringify(updatedDieta)}`);
      return { event: 'updateDietaSuccess', data: updatedDieta }; // Respuesta ACK
    } catch (error) {
      this.logger.error(`Error updating dieta: ${error.message}`);
      client.emit('dietaError', { event: 'updateDieta', message: error.message, details: error.response });
      return { event: 'updateDietaFailure', error: error.message }; // Respuesta ACK con error
    }
  }

  @SubscribeMessage('removeDieta') // Evento para eliminar una dieta
  @UsePipes(new ValidationPipe({ transform: true }))
  async remove(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received removeDieta event from ${client.id} with id: ${id}`);
    try {
      const removed = await this.dietaService.remove(id);
      if (removed) {
        this.server.emit('dietaRemoved', { id: id, success: true });
        this.logger.log(`Dieta with id ${id} removed and emitted.`);
        return { event: 'removeDietaSuccess', data: { id: id, success: true } }; // Respuesta ACK
      }
    } catch (error) {
      this.logger.error(`Error removing dieta by id ${id}: ${error.message}`);
      client.emit('dietaError', { event: 'removeDieta', message: error.message, details: error.response });
      return { event: 'removeDietaFailure', error: error.message }; // Respuesta ACK con error
    }
  }

  // ==============================================
  // Eventos de Conexión y Desconexión (Opcional)
  // ==============================================

  afterInit(server: Server) {
    this.logger.log('Dieta Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    // Opcional: Puedes enviar un mensaje de bienvenida al cliente
    // client.emit('connectionStatus', 'Connected to Dieta API');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
