import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { ProductCategory } from '../entities/product.entity';

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ProductGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly productService: ProductService) {}

  @SubscribeMessage('getProducts')
  async handleGetProducts(
    @MessageBody() category: ProductCategory,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const products = category 
        ? await this.productService.findByCategory(category)
        : await this.productService.findAll();
      
      client.emit('productsList', {
        success: true,
        products,
        category
      });

      return { success: true, products };
    } catch (error) {
      client.emit('productError', {
        success: false,
        message: error.message
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('getProduct')
  async handleGetProduct(
    @MessageBody() productId: string,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const product = await this.productService.findOne(productId);
      
      client.emit('productDetails', {
        success: true,
        product
      });

      return { success: true, product };
    } catch (error) {
      client.emit('productError', {
        success: false,
        message: error.message
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('createProduct')
  async handleCreateProduct(
    @MessageBody() createProductDto: CreateProductDto,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const product = await this.productService.create(createProductDto);
      
      // Emit to the client that created the product
      client.emit('productCreated', {
        success: true,
        product,
        message: 'Product created successfully'
      });

      // Broadcast to all connected clients about new product
      this.server.emit('newProduct', {
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.basePrice,
        timestamp: new Date()
      });

      return { success: true, product };
    } catch (error) {
      client.emit('productError', {
        success: false,
        message: error.message
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('updateProduct')
  async handleUpdateProduct(
    @MessageBody() data: { id: string; updateProductDto: UpdateProductDto },
    @ConnectedSocket() client: Socket
  ) {
    try {
      const product = await this.productService.update(data.id, data.updateProductDto);
      
      // Emit to the client that updated the product
      client.emit('productUpdated', {
        success: true,
        product,
        message: 'Product updated successfully'
      });

      // Broadcast to all connected clients about product update
      this.server.emit('productChanged', {
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.basePrice,
        timestamp: new Date()
      });

      return { success: true, product };
    } catch (error) {
      client.emit('productError', {
        success: false,
        message: error.message
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('getProductPrice')
  async handleGetProductPrice(
    @MessageBody() productId: string,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const price = await this.productService.getProductPrice(productId);
      
      client.emit('productPrice', {
        success: true,
        productId,
        price
      });

      return { success: true, price };
    } catch (error) {
      client.emit('productError', {
        success: false,
        message: error.message
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('joinProductCategory')
  handleJoinProductCategory(
    @MessageBody() category: ProductCategory,
    @ConnectedSocket() client: Socket
  ) {
    client.join(`category-${category}`);
    client.emit('joinedCategory', {
      category,
      message: `Joined category ${category}`
    });
  }

  @SubscribeMessage('leaveProductCategory')
  handleLeaveProductCategory(
    @MessageBody() category: ProductCategory,
    @ConnectedSocket() client: Socket
  ) {
    client.leave(`category-${category}`);
    client.emit('leftCategory', {
      category,
      message: `Left category ${category}`
    });
  }

  handleConnection(client: Socket) {
    console.log(`Product client connected: ${client.id}`);
    client.emit('connected', {
      message: 'Connected to product service',
      clientId: client.id
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Product client disconnected: ${client.id}`);
  }
} 