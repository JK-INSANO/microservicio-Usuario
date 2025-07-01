

# Microservicio de Usuarios

Este proyecto es un microservicio de gestión de usuarios desarrollado con NestJS y MongoDB. Proporciona funcionalidades para registro, autenticación y gestión de diferentes tipos de usuarios (clientes, tiendas y repartidores).

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [MongoDB](https://www.mongodb.com/try/download/community) (v6.0 o superior)
- [npm](https://www.npmjs.com/) (normalmente viene con Node.js)

## Configuración del proyecto (PASOS A SEGUIR)

### 1. Clonar el repositorio

```bash
$ git clone <url-del-repositorio>
$ cd <nombre-del-directorio>
```

### 2. Instalar dependencias

```bash
$ npm install
```

### 3. Configurar MongoDB

Asegúrate de tener MongoDB instalado y en ejecución en tu sistema.

Para instalar MongoDB:
- **Windows**: Descarga e instala desde [mongodb.com](https://www.mongodb.com/try/download/community)
- **macOS**: `brew install mongodb-community`
- **Linux (Ubuntu)**: 
  ```bash
  sudo apt update
  sudo apt install -y mongodb
  sudo systemctl start mongodb
  ```

Verifica que MongoDB esté funcionando:
```bash
$ mongosh
```

### 4. Configuración de la base de datos

El proyecto está configurado para conectarse a MongoDB en localhost:27017 con la base de datos "DbWeb".

Si necesitas cambiar esta configuración, modifica los siguientes valores en el archivo `src/app.module.ts`:

```typescript
MongooseModule.forRoot(`mongodb://localhost:27017/DbWeb`)
```

## Ejecutar el proyecto

### Desarrollo

```bash
# Modo de desarrollo
$ npm run start

# Modo de desarrollo con recarga automática
$ npm run start:dev
```

### Producción

```bash
# Compilar el proyecto
$ npm run build

# Ejecutar en modo producción
$ npm run start:prod
```

## Estructura del proyecto

- `src/auth`: Módulo de autenticación y autorización
- `src/user`: Módulo de gestión de usuarios
- `src/mail`: Módulo para envío de correos electrónicos

## API Endpoints

### Autenticación

- `POST /api/auth/register`: Registrar un nuevo usuario
- `POST /api/auth/login`: Iniciar sesión
- `POST /api/auth/refresh`: Renovar token de acceso
- `POST /api/auth/logout`: Cerrar sesión

### Usuarios

- `GET /api/users`: Obtener todos los usuarios
- `GET /api/users/:id`: Obtener un usuario por ID
- `GET /api/users/customers`: Obtener todos los clientes
- `GET /api/users/stores`: Obtener todas las tiendas
- `GET /api/users/delivery`: Obtener todos los repartidores
- `GET /api/users/stats`: Obtener estadísticas de usuarios


## Tipos de usuarios

El sistema maneja cuatro tipos de usuarios:

1. **Clientes (usuario)**: Usuarios normales que realizan pedidos
2. **Tiendas (tienda)**: Comercios que ofrecen productos
3. **Repartidores (delivery)**: Encargados de entregar pedidos
4. **Administradores (admin)**: Gestores del sistema


# ----------------------------------------------------------------------------------------------------------


# Plataforma de Comercio Electrónico - Arquitectura de Microservicios (RESUMEN TODO EL PROYECTO)

## Descripción General

Este proyecto implementa una plataforma completa de comercio electrónico utilizando una arquitectura de microservicios. Cada componente está diseñado para funcionar de manera independiente, permitiendo escalabilidad, mantenimiento y desarrollo más eficientes.

## Arquitectura

![Arquitectura de Microservicios]

### Componentes Principales

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend (Next.js) | 3000 | Interfaz de usuario para clientes y tiendas |
| Microservicio de Usuarios | 3001 | Gestión de usuarios, autenticación y perfiles |
| Microservicio de Tienda | 3002 | Gestión de productos, pedidos y tiendas |

## Tecnologías Utilizadas

- **Frontend**: Next.js, React, TypeScript
- **Backend**: NestJS, TypeScript
- **Base de Datos**: MongoDB
- **Autenticación**: JWT
- **Comunicación**: REST API, TCP (microservicios)
- **Documentación API**: Swagger
- **Contenedores**: Docker (opcional)

## Microservicios

### 1. Frontend (insane)

Aplicación web construida con Next.js que proporciona la interfaz de usuario para todos los tipos de usuarios.

```bash
# Instalación
cd insane
npm install

# Ejecución
npm run dev
```

**Características principales:**
- Catálogo de productos
- Carrito de compras
- Gestión de pedidos
- Panel de administración para tiendas
- Autenticación de usuarios

### 2. Microservicio de Usuarios (microservicio-Usuario)

Gestiona la autenticación, registro y perfiles de usuarios.

```bash
# Instalación
cd microservicio-Usuario
npm install


# Ejecución
npm run start:dev
```

**Características principales:**
- Registro y autenticación de usuarios
- Gestión de perfiles
- Roles y permisos
- Recuperación de contraseña
- Comunicación por microservicios (TCP puerto 3001)

### 3. Microservicio de Tienda (store-microservice-f)

Gestiona productos, pedidos, proveedores y reseñas.

```bash
# Instalación
cd store-microservice-f
npm install

# Ejecución
npm run dev
```

**Características principales:**
- Gestión de productos
- Procesamiento de pedidos
- Gestión de proveedores
- Sistema de reseñas
- Panel de estadísticas

## Configuración de Base de Datos

Todos los microservicios utilizan MongoDB. Asegúrate de tener MongoDB instalado y ejecutándose


La base de datos predeterminada es `DbWeb` y se ejecuta en `localhost:27017`.

## Flujo de Comunicación

1. El cliente interactúa con el frontend (Next.js)
2. El frontend se comunica con los microservicios a través de API REST
3. Los microservicios se comunican entre sí mediante TCP cuando es necesario
4. Cada microservicio gestiona su propia conexión a la base de datos

## Endpoints Principales

### Microservicio de Usuarios (http://localhost:3000/api)
- **Autenticación**: `/auth/login`, `/auth/register`
- **Usuarios**: `/users`, `/users/:id`
- **Perfiles**: `/users/profile`

### Microservicio de Tienda (http://localhost:3002/api/store)
- **Productos**: `/products`, `/products/:id`
- **Pedidos**: `/orders`, `/orders/:id`
- **Proveedores**: `/suppliers`, `/suppliers/:id`
- **Reseñas**: `/reviews`, `/reviews/:id`
- **Dashboard**: `/dashboard`

## Desarrollo

### Requisitos Previos
- Node.js (v16+)
- MongoDB
- npm o yarn


