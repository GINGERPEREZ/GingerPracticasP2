// src/websocket/customization.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { CustomizationService } from '../services/customization.service';
import { Server } from 'socket.io';
import { CreateCustomizationDto } from '../dto/customization.dto';

@WebSocketGateway()
export class CustomizationGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly customizationService: CustomizationService) {}

  @SubscribeMessage('createCustomization')
  async handleCreate(@MessageBody() dto: CreateCustomizationDto) {
    const customization = await this.customizationService.create(dto);
    this.server.emit('customizationCreated', customization);
    return customization;
  }
}