Proyecto de Gestión de Mascotas con NestJS y GraphQL
Este proyecto es una API GraphQL construida con NestJS, TypeORM y SQLite, diseñada para gestionar información relacionada con mascotas, sus historiales médicos y sus dietas. Demuestra una arquitectura por capas clara, siguiendo las mejores prácticas de desarrollo en NestJS.

🚀 Tecnologías Utilizadas
NestJS: Un framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables.

GraphQL: Un lenguaje de consulta de datos para APIs y un runtime para cumplir esas consultas con tus datos existentes.

Apollo Server: Un servidor GraphQL robusto y de alto rendimiento.

TypeORM: Un ORM (Object-Relational Mapper) para TypeScript y JavaScript que soporta múltiples bases de datos.

SQLite: Una base de datos ligera, basada en archivos, ideal para desarrollo y pruebas.

Class-Validator / Class-Transformer: Para la validación y transformación de datos en los DTOs.

📦 Estructura del Proyecto
El proyecto sigue una arquitectura modular, donde cada dominio (Mascota, Historial Médico, Dieta) tiene su propio módulo, encapsulando sus componentes relacionados:

src/
├── app.module.ts           # Módulo raíz de la aplicación
├── main.ts                 # Punto de entrada de la aplicación
├── datos_mascota/          # Módulo para la gestión de Datos de Mascotas
│   ├── dto/
│   │   ├── create-datos-mascota.input.ts
│   │   └── update-datos-mascota.input.ts
│   ├── entities/
│   │   └── datos-mascota.entity.ts
│   ├── datos-mascota.module.ts
│   ├── datos-mascota.resolver.ts
│   └── datos-mascota.service.ts
├── dieta/                  # Módulo para la gestión de Dietas
│   ├── dto/
│   │   ├── create-dieta.input.ts
│   │   └── update-dieta.input.ts
│   ├── entities/
│   │   └── dieta.entity.ts
│   ├── dieta.module.ts
│   ├── dieta.resolver.ts
│   └── dieta.service.ts
├── historial_medico/       # Módulo para la gestión de Historiales Médicos
│   ├── dto/
│   │   ├── create-historial-medico.input.ts
│   │   └── update-historial-medico.input.ts
│   ├── entities/
│   │   └── historial-medico.entity.ts
│   ├── historial-medico.module.ts
│   ├── historial-medico.resolver.ts
│   └── historial-medico.service.ts
└── schema.gql              # Esquema GraphQL autogenerado

🛠️ Configuración y Ejecución
Prerrequisitos
Node.js (versión 16.x o superior)

npm (viene con Node.js)

NestJS CLI (instalar globalmente: npm i -g @nestjs/cli)

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

La aplicación se ejecutará en http://localhost:3000.

🌐 Usar la API GraphQL
Una vez que la aplicación esté corriendo, puedes acceder a la interfaz interactiva de GraphQL Playground (o Apollo Sandbox) en:

http://localhost:3000/graphql

Aquí puedes explorar el esquema de tu API y realizar consultas y mutaciones.

Ejemplos de Operaciones
1. Crear una Mascota (Mutation)
mutation CreateMascota {
  createDatosMascota(createDatosMascotaInput: {
    nombre: "Max",
    especie: "Perro",
    raza: "Labrador",
    edad: 3,
    sexo: "Macho",
    color: "Dorado",
    fecha_ingreso: "2023-01-15"
  }) {
    id
    nombre
    especie
    raza
  }
}

2. Crear un Historial Médico (Mutation)
Nota: Necesitarás el id de una mascota existente.

mutation CreateHistorial {
  createHistorialMedico(createHistorialMedicoInput: {
    mascotaId: 1, # <--- ¡REEMPLAZA CON EL ID REAL DE TU MASCOTA!
    diagnosticos: "Tos de perrera, leve",
    tratamientos: "Reposo, jarabe para la tos",
    fecha_registro: "2024-07-29",
    veterinario: "Dr. Ana Gómez"
  }) {
    id
    diagnosticos
    fecha_registro
    mascota {
      id
      nombre
    }
  }
}

3. Crear una Dieta (Mutation)
Nota: Necesitarás el id de una mascota existente.

mutation CreateDieta {
  createDieta(createDietaInput: {
    mascotaId: 1, # <--- ¡REEMPLAZA CON EL ID REAL DE TU MASCOTA!
    tipo_alimento: "Pienso seco premium",
    cantidad_diaria: "300 gramos",
    horario_comidas: "8:00 AM, 6:00 PM",
    restricciones: "Ninguna"
  }) {
    id
    tipo_alimento
    cantidad_diaria
    mascota {
      id
      nombre
    }
  }
}

4. Obtener todas las Mascotas (Query)
query GetAllMascotas {
  datosMascotas {
    id
    nombre
    especie
    edad
    historiales { # Puedes solicitar los historiales asociados
      id
      diagnosticos
    }
    dietas { # Puedes solicitar las dietas asociadas
      id
      tipo_alimento
    }
  }
}

5. Actualizar una Mascota (Mutation)
mutation UpdateMascota {
  updateDatosMascota(updateDatosMascotaInput: {
    id: 1, # <--- ¡REEMPLAZA CON EL ID REAL DE TU MASCOTA!
    nombre: "Maximus",
    edad: 4
  }) {
    id
    nombre
    edad
  }
}

6. Eliminar un Historial Médico (Mutation)
mutation RemoveHistorial {
  removeHistorialMedico(id: 1) { # <--- ¡REEMPLAZA CON EL ID REAL DEL HISTORIAL!
    id
  }
}

¡Esperamos que disfrutes explorando y extendiendo esta API!