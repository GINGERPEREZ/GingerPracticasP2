import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

// Entities
import { Product } from './entities/product.entity';
import { Customization } from './entities/customization.entity';
import { Order } from './entities/order.entity';

// Services
import { ProductService } from './services/product.service';
import { CustomizationService } from './services/customization.service';
import { OrderService } from './services/order.service';

// Controllers (REST)
import { ProductController } from './controllers/product.controller';
import { CustomizationController } from './controllers/customization.controller';
import { OrderController } from './controllers/order.controller';

// GraphQL Resolvers
import { ProductResolver } from './graphql/product.resolver';
import { OrderResolver } from './graphql/order.resolver';

// WebSocket Gateways
import { ProductGateway } from './websocket/product.gateway';
import { OrderGateway } from './websocket/order.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'ecommerce.db',
      entities: [Product, Customization, Order],
      synchronize: true, // Only for development
    }),
    TypeOrmModule.forFeature([Product, Customization, Order]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
  ],
  controllers: [
    ProductController,
    CustomizationController,
    OrderController,
  ],
  providers: [
    ProductService,
    CustomizationService,
    OrderService,
    ProductResolver,
    OrderResolver,
    ProductGateway,
    OrderGateway,
  ],
})
export class AppModule {} 