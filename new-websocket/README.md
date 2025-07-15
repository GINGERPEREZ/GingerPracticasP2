Proyecto de Gestión de Mascotas en Tiempo Real con NestJS y WebSockets
Este proyecto es una API en tiempo real construida con NestJS, WebSockets (Socket.IO), TypeORM y SQLite, diseñada para gestionar información sobre mascotas, sus historiales médicos y sus dietas. Demuestra una arquitectura por capas clara y la capacidad de notificar cambios en tiempo real a todos los clientes conectados.

🚀 Tecnologías Utilizadas
NestJS: Un framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables.

WebSockets (Socket.IO): Para comunicación bidireccional en tiempo real entre el servidor y los clientes.

@nestjs/websockets & @nestjs/platform-socket.io: Módulos de NestJS para la integración de WebSockets.

TypeORM: Un ORM (Object-Relational Mapper) para TypeScript y JavaScript que soporta múltiples bases de datos.

SQLite: Una base de datos ligera, basada en archivos, ideal para desarrollo y pruebas.

Class-Validator / Class-Transformer: Para la validación y transformación de datos en los DTOs.

@nestjs/mapped-types: Para facilitar la creación de DTOs de actualización (PartialType).

📦 Estructura del Proyecto
El proyecto sigue una arquitectura modular y por capas, donde cada dominio (Mascota, Historial Médico, Dieta) tiene su propio módulo, encapsulando sus componentes relacionados:

src/
├── app.module.ts           # Módulo raíz de la aplicación
├── main.ts                 # Punto de entrada de la aplicación
├── datos_mascota/          # Módulo para la gestión de Datos de Mascotas
│   ├── dto/
│   │   ├── create-datos-mascota.dto.ts
│   │   └── update-datos-mascota.dto.ts
│   ├── entities/
│   │   └── datos-mascota.entity.ts
│   ├── datos-mascota.module.ts
│   ├── datos-mascota.gateway.ts    # Maneja eventos WebSocket
│   └── datos-mascota.service.ts
├── dieta/                  # Módulo para la gestión de Dietas
│   ├── dto/
│   │   ├── create-dieta.dto.ts
│   │   └── update-dieta.dto.ts
│   ├── entities/
│   │   └── dieta.entity.ts
│   ├── dieta.module.ts
│   ├── dieta.gateway.ts            # Maneja eventos WebSocket
│   └── dieta.service.ts
├── historial_medico/       # Módulo para la gestión de Historiales Médicos
│   ├── dto/
│   │   ├── create-historial-medico.dto.ts
│   │   └── update-historial-medico.dto.ts
│   ├── entities/
│   │   └── historial-medico.entity.ts
│   ├── historial-medico.module.ts
│   ├── historial-medico.gateway.ts # Maneja eventos WebSocket
│   └── historial-medico.service.ts

🛠️ Configuración y Ejecución
Prerrequisitos
Node.js (versión 16.x o superior, se recomienda 18 LTS o superior)

npm (viene con Node.js)

NestJS CLI (instalar globalmente: npm i -g @nestjs/cli)

Postman v10+ o Insomnia 2023+ (con soporte WebSocket)

Instalación
Clona este repositorio (o asegúrate de estar en la raíz de tu proyecto):

git clone <URL_DEL_REPOSITORIO>
cd <nombre-del-proyecto>

Instala las dependencias del proyecto:

npm install

Base de Datos (SQLite)
El proyecto utiliza SQLite, una base de datos basada en archivos. No se requiere configuración adicional de servidor. La base de datos se creará automáticamente como db.sqlite en la raíz del proyecto cuando la aplicación se inicie por primera vez, gracias a la configuración synchronize: true en TypeOrmModule.forRoot() (solo para desarrollo).

▶️ Ejecutar la Aplicación
Para iniciar la aplicación en modo de desarrollo (con recarga automática al detectar cambios):

npm run start:dev

La aplicación se ejecutará en http://localhost:3000. El servidor WebSocket estará escuchando en el mismo puerto.

🌐 Probar la API WebSocket
Puedes usar Postman o Insomnia para interactuar con la API WebSocket.

Abre Postman/Insomnia.

Crea una nueva solicitud WebSocket.

Conéctate a la URL del servidor WebSocket: ws://localhost:3000

Ejemplos de Interacción
Una vez conectado, puedes enviar mensajes (eventos) al servidor y escuchar las respuestas.

1. Crear una Mascota (Evento: createDatosMascota)
Envía este JSON como mensaje:

{
  "event": "createDatosMascota",
  "data": {
    "nombre": "Max",
    "especie": "Perro",
    "raza": "Labrador",
    "edad": 3,
    "sexo": "Macho",
    "color": "Dorado",
    "fecha_ingreso": "2023-01-15"
  }
}

Eventos esperados del servidor:

ACK (respuesta a la solicitud): Un mensaje de confirmación de éxito o error (ej. {"event":"createDatosMascotaSuccess","data":{...}}).

Notificación a todos los clientes: datosMascotaCreated con el objeto de la mascota creada (ej. {"event":"datosMascotaCreated","data":{...}}).

2. Crear un Historial Médico (Evento: createHistorialMedico)
Nota: Necesitarás el id de una mascota existente.

Envía este JSON como mensaje:

{
  "event": "createHistorialMedico",
  "data": {
    "mascotaId": 1, # <--- ¡REEMPLAZA CON EL ID REAL DE TU MASCOTA!
    "diagnosticos": "Tos de perrera, leve",
    "tratamientos": "Reposo, jarabe para la tos",
    "fecha_registro": "2024-07-29",
    "veterinario": "Dr. Ana Gómez"
  }
}

Eventos esperados del servidor:

ACK: {"event":"createHistorialMedicoSuccess","data":{...}}

Notificación a todos los clientes: historialMedicoCreated con el objeto del historial creado.

3. Crear una Dieta (Evento: createDieta)
Nota: Necesitarás el id de una mascota existente.

Envía este JSON como mensaje:

{
  "event": "createDieta",
  "data": {
    "mascotaId": 1, # <--- ¡REEMPLAZA CON EL ID REAL DE TU MASCOTA!
    "tipo_alimento": "Pienso seco premium",
    "cantidad_diaria": "300 gramos",
    "horario_comidas": "8:00 AM, 6:00 PM",
    "restricciones": "Ninguna"
  }
}

Eventos esperados del servidor:

ACK: {"event":"createDietaSuccess","data":{...}}

Notificación a todos los clientes: dietaCreated con el objeto de la dieta creada.

4. Obtener todas las Mascotas (Evento: findAllDatosMascotas)
Envía este JSON como mensaje:

{
  "event": "findAllDatosMascotas"
}

Eventos esperados del servidor:

Notificación al cliente que envió la solicitud: allDatosMascotas con un array de todas las mascotas (ej. {"event":"allDatosMascotas","data":[{...},{...}]}).

ACK: {"event":"findAllDatosMascotasSuccess","data":[{...}]}

5. Obtener un Historial Médico por ID (Evento: findOneHistorialMedico)
Envía este JSON como mensaje:

{
  "event": "findOneHistorialMedico",
  "data": {
    "id": 1 # <--- ¡REEMPLAZA CON EL ID REAL DEL HISTORIAL!
  }
}

Eventos esperados del servidor:

Notificación al cliente que envió la solicitud: historialMedicoFound con el objeto del historial encontrado.

ACK: {"event":"findOneHistorialMedicoSuccess","data":{...}}

6. Actualizar una Dieta (Evento: updateDieta)
Envía este JSON como mensaje:

{
  "event": "updateDieta",
  "data": {
    "id": 1, # <--- ¡REEMPLAZA CON EL ID REAL DE LA DIETA!
    "cantidad_diaria": "350 gramos",
    "restricciones": "Sin pollo"
  }
}

Eventos esperados del servidor:

ACK: {"event":"updateDietaSuccess","data":{...}}

Notificación a todos los clientes: dietaUpdated con el objeto de la dieta actualizada.

7. Eliminar una Mascota (Evento: removeDatosMascota)
Envía este JSON como mensaje:

{
  "event": "removeDatosMascota",
  "data": {
    "id": 1 # <--- ¡REEMPLAZA CON EL ID REAL DE LA MASCOTA!
  }
}

Eventos esperados del servidor:

ACK: {"event":"removeDatosMascotaSuccess","data":{"id":1,"success":true}}

Notificación a todos los clientes: datosMascotaRemoved con el ID de la mascota eliminada.

¡Esperamos que disfrutes desarrollando y probando esta API en tiempo real!