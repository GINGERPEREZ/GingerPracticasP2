# E-commerce Backend - Examen

## Descripción del Proyecto

Este proyecto implementa el backend necesario para las 3 pantallas de una aplicación de e-commerce usando diferentes tecnologías según los requerimientos del examen:

1. **🛍️ Pantalla de Personalización de Productos** - **REST API**
2. **📦 Pantalla de Información de Envío** - **GraphQL**
3. **💳 Pantalla de Resumen de Pedido y Pago** - **WebSocket**

## Tecnologías Utilizadas

- **NestJS** - Framework principal
- **REST API** - Para personalización de productos
- **GraphQL** - Para información de envío
- **WebSocket** - Para resumen de pedido y pago

## Estructura del Proyecto

```
src/
├── controllers/          # REST API Controllers
│   ├── product.controller.ts      # 🛍️ Pantalla 1 - Personalización
│   ├── customization.controller.ts # 🛍️ Pantalla 1 - Personalización
│   └── order.controller.ts        # 🛍️ Pantalla 1 - Personalización
├── graphql/             # GraphQL Resolvers
│   ├── product.resolver.ts        # 📦 Pantalla 2 - Información de Envío
│   └── order.resolver.ts          # 📦 Pantalla 2 - Información de Envío
├── websocket/           # WebSocket Gateways
│   ├── product.gateway.ts         # 💳 Pantalla 3 - Resumen y Pago
│   └── order.gateway.ts           # 💳 Pantalla 3 - Resumen y Pago
├── services/            # Business Logic
│   ├── product.service.ts         # 🛍️ Pantalla 1 + 📦 Pantalla 2
│   ├── customization.service.ts   # 🛍️ Pantalla 1
│   └── order.service.ts           # 📦 Pantalla 2 + 💳 Pantalla 3
├── entities/            # Database Entities
│   ├── product.entity.ts          # Todas las pantallas
│   ├── customization.entity.ts    # 🛍️ Pantalla 1
│   └── order.entity.ts            # 📦 Pantalla 2 + 💳 Pantalla 3
├── dto/                 # Data Transfer Objects
│   ├── product.dto.ts             # 🛍️ Pantalla 1 + 📦 Pantalla 2
│   ├── customization.dto.ts       # 🛍️ Pantalla 1
│   └── order.dto.ts               # 📦 Pantalla 2 + 💳 Pantalla 3
└── data/                # Persistence
    └── persistence.json
```

## Implementación por Pantalla

### 🛍️ 1. Pantalla de Personalización de Productos (REST API)

**Tecnología:** REST API
**Funcionalidad:** Selección de productos, personalización (color, texto, imágenes), cantidad

**Archivos que la implementan:**
- `controllers/product.controller.ts` - Endpoints REST para productos
- `controllers/customization.controller.ts` - Endpoints REST para personalizaciones
- `services/product.service.ts` - Lógica de negocio de productos
- `services/customization.service.ts` - Lógica de negocio de personalizaciones
- `entities/product.entity.ts` - Entidad de productos
- `entities/customization.entity.ts` - Entidad de personalizaciones
- `dto/product.dto.ts` - DTOs para productos
- `dto/customization.dto.ts` - DTOs para personalizaciones


### 📦 2. Pantalla de Información de Envío (GraphQL)

**Tecnología:** GraphQL
**Funcionalidad:** Gestión de direcciones de envío, información de pedidos

**Archivos que la implementan:**
- `graphql/order.resolver.ts` - Resolvers GraphQL para pedidos
- `graphql/product.resolver.ts` - Resolvers GraphQL para productos
- `services/order.service.ts` - Lógica de negocio de pedidos
- `services/product.service.ts` - Lógica de negocio de productos
- `entities/order.entity.ts` - Entidad de pedidos
- `entities/product.entity.ts` - Entidad de productos
- `dto/order.dto.ts` - DTOs para pedidos (con decoradores GraphQL)
``

### 💳 3. Pantalla de Resumen de Pedido y Pago (WebSocket)

**Tecnología:** WebSocket
**Funcionalidad:** Resumen de pedido, selección de método de pago, confirmación en tiempo real

**Archivos que la implementan:**
- `websocket/order.gateway.ts` - Gateway WebSocket para pedidos
- `websocket/product.gateway.ts` - Gateway WebSocket para productos
- `services/order.service.ts` - Lógica de negocio de pedidos
- `services/product.service.ts` - Lógica de negocio de productos
- `entities/order.entity.ts` - Entidad de pedidos
- `entities/product.entity.ts` - Entidad de productos
- `dto/order.dto.ts` - DTOs para pedidos

**Eventos WebSocket disponibles:**
```javascript
// Cliente se conecta al servicio de pedidos
socket.on('connected', (data) => {
  console.log('Conectado al servicio de pedidos');
});

// Crear pedido con método de pago
socket.emit('createOrder', {
  userId: 'user123',
  paymentMethod: 'tarjeta_credito', // o 'paypal'
  shippingAddress: '123 Main St',
  postalCode: '12345',
  city: 'New York',
  country: 'USA',
  orderItems: [{
    productId: 'prod123',
    quantity: 2,
    price: 29.99
  }]
});

// Escuchar confirmación de pedido creado
socket.on('orderCreated', (data) => {
  console.log('Pedido creado:', data.order);
});

// Obtener resumen del pedido para la pantalla de pago
socket.emit('getOrderSummary', 'order123');
socket.on('orderSummary', (data) => {
  console.log('Resumen del pedido:', data.summary);
  // Muestra: subtotal, shippingCost, total, itemCount
});

// Actualizar estado del pedido (confirmar pago)
socket.emit('updateOrderStatus', {
  id: 'order123',
  updateOrderStatusDto: { status: 'confirmed' }
});

// Escuchar cambios de estado en tiempo real
socket.on('orderStatusChanged', (data) => {
  console.log('Estado del pedido cambiado:', data);
});

// Unirse a sala específica del pedido
socket.emit('joinOrderRoom', 'order123');
socket.on('joinedOrderRoom', (data) => {
  console.log('Unido a la sala del pedido');
});
```

## Entidades de Base de Datos

### Product (Todas las pantallas)
```typescript
{
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: ProductCategory; // TSHIRTS, MUGS, NOTEBOOKS
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Customization (🛍️ Pantalla 1)
```typescript
{
  id: string;
  productId: string;
  customizationType: string; // color, text, image
  customizationValue: string;
  customizationPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Order (📦 Pantalla 2 + 💳 Pantalla 3)
```typescript
{
  id: string;
  userId: string;
  status: OrderStatus; // pending, confirmed, shipped, delivered, cancelled
  paymentMethod: PaymentMethod; // tarjeta_credito, paypal
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: string;
  postalCode: string;
  city: string;
  country: string;
  orderItems: any[]; // JSON array
  createdAt: Date;
  updatedAt: Date;
}
```

## Instalación y Ejecución

1. **Instalar dependencias:**
```bash
npm install
```

2. **Ejecutar la aplicación:**
```bash
npm run start:dev
```

3. **Acceder a los servicios:**
- **REST API:** http://localhost:3000/api
- **GraphQL Playground:** http://localhost:3000/graphql
- **WebSocket:** ws://localhost:3000

## Características Implementadas

✅ **DTOs** - Data Transfer Objects para todas las entidades
✅ **Servicios** - Lógica de negocio implementada
✅ **Persistencia** - Base de datos SQLite con TypeORM
✅ **REST API** - Para personalización de productos (Pantalla 1)
✅ **GraphQL** - Para información de envío (Pantalla 2)
✅ **WebSocket** - Para resumen de pedido y pago (Pantalla 3)
✅ **Validación** - Class-validator para validación de datos
✅ **Manejo de errores** - Excepciones personalizadas

## Resumen de Implementación por Pantalla

| Pantalla | Tecnología | Archivos Principales | Funcionalidad |
|----------|------------|---------------------|---------------|
| 🛍️ Personalización | REST API | `controllers/`, `services/product.service.ts`, `services/customization.service.ts` | Selección y personalización de productos |
| 📦 Información de Envío | GraphQL | `graphql/order.resolver.ts`, `services/order.service.ts` | Gestión de direcciones y pedidos |
| 💳 Resumen y Pago | WebSocket | `websocket/order.gateway.ts`, `services/order.service.ts` | Resumen, pago y confirmación en tiempo real |

## Notas del Examen

- ✅ Se eliminaron las entidades `OrderItem` y `User` como se solicitó
- ✅ Los `orderItems` se almacenan como JSON en la entidad `Order`
- ✅ Cada pantalla usa una tecnología diferente según los requerimientos
- ✅ El backend está listo para que el frontend pueda ser desarrollado posteriormente
- ✅ Todas las funcionalidades están implementadas con DTOs, servicios y persistencia

