import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrderService } from '../services/order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from '../dto/order.dto';

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class OrderGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly orderService: OrderService) {}

  @SubscribeMessage('createOrder')
  async handleCreateOrder(
    @MessageBody() createOrderDto: CreateOrderDto,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const order = await this.orderService.create(createOrderDto);
      
      // Emit to the client that created the order
      client.emit('orderCreated', {
        success: true,
        order,
        message: 'Order created successfully'
      });

      // Broadcast to all connected clients about new order
      this.server.emit('newOrder', {
        orderId: order.id,
        userId: order.userId,
        total: order.total,
        timestamp: new Date()
      });

      return { success: true, order };
    } catch (error) {
      client.emit('orderError', {
        success: false,
        message: error.message
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('updateOrderStatus')
  async handleUpdateOrderStatus(
    @MessageBody() data: { id: string; updateOrderStatusDto: UpdateOrderStatusDto },
    @ConnectedSocket() client: Socket
  ) {
    try {
      const order = await this.orderService.updateStatus(data.id, data.updateOrderStatusDto);
      
      // Emit to the client that updated the order
      client.emit('orderStatusUpdated', {
        success: true,
        order,
        message: 'Order status updated successfully'
      });

      // Broadcast to all connected clients about status change
      this.server.emit('orderStatusChanged', {
        orderId: order.id,
        newStatus: order.status,
        timestamp: new Date()
      });

      return { success: true, order };
    } catch (error) {
      client.emit('orderError', {
        success: false,
        message: error.message
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('getOrderSummary')
  async handleGetOrderSummary(
    @MessageBody() orderId: string,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const summary = await this.orderService.getOrderSummary(orderId);
      
      client.emit('orderSummary', {
        success: true,
        summary
      });

      return { success: true, summary };
    } catch (error) {
      client.emit('orderError', {
        success: false,
        message: error.message
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('joinOrderRoom')
  handleJoinOrderRoom(
    @MessageBody() orderId: string,
    @ConnectedSocket() client: Socket
  ) {
    client.join(`order-${orderId}`);
    client.emit('joinedOrderRoom', {
      orderId,
      message: `Joined room for order ${orderId}`
    });
  }

  @SubscribeMessage('leaveOrderRoom')
  handleLeaveOrderRoom(
    @MessageBody() orderId: string,
    @ConnectedSocket() client: Socket
  ) {
    client.leave(`order-${orderId}`);
    client.emit('leftOrderRoom', {
      orderId,
      message: `Left room for order ${orderId}`
    });
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('connected', {
      message: 'Connected to order service',
      clientId: client.id
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
} 