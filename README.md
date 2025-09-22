# Taller Interestelar - Frontend

Frontend del Sistema de Gestión de Taller Mecánico desarrollado con React, Vite y Tailwind CSS.

## 🚀 Características

- **Interfaz moderna y responsive** con Tailwind CSS
- **Autenticación JWT** con protección de rutas
- **Dashboard interactivo** con diferentes vistas según el rol
- **Gestión de autos** con estados y prioridades
- **Sistema de reparaciones** con asignación de mecánicos
- **Gestión de pagos** con diferentes métodos y estados
- **Notificaciones toast** para mejor UX
- **Diseño mobile-first** y responsive

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Backend funcionando en puerto 3001

## 🛠️ Instalación

1. **Instalar dependencias**
```bash
cd frontend
npm install
```

2. **Configurar variables de entorno**
Crear un archivo `.env` en la raíz del frontend:
```env
VITE_API_URL=http://localhost:3001/api
```

3. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`


## 🎯 Funcionalidades por Rol

### Jefe/Admin
- Acceso completo a todas las funcionalidades
- Crear, editar y eliminar autos, reparaciones y pagos
- Asignar mecánicos a reparaciones
- Gestionar usuarios del sistema
- Ver estadísticas completas

### Mecánico
- Ver autos asignados
- Ver reparaciones asignadas
- Actualizar estado de reparaciones
- Ver historial de trabajo

### Cliente
- Ver sus autos
- Ver estado de reparaciones
- Ver historial de pagos
- Actualizar información personal

## 🎨 Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **Tailwind CSS** - Framework de CSS
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios
- **React Hot Toast** - Notificaciones
- **Lucide React** - Iconos

## 📱 Componentes Principales

### Login
- Formulario de autenticación con validaciones
- Manejo de errores y estados de carga
- Redirección automática después del login

### Dashboard
- **Resumen**: Estadísticas generales del sistema
- **Autos**: Lista de autos con filtros y acciones
- **Reparaciones**: Gestión de reparaciones y asignaciones
- **Pagos**: Control de pagos y estados

## 🔌 Integración con Backend

El frontend se comunica con el backend a través de:

- **Base URL**: `http://localhost:3001/api`
- **Autenticación**: JWT en headers de Authorization
- **Interceptores**: Manejo automático de tokens y errores 401

### Servicios Disponibles

- `authService` - Login, registro y perfil
- `usersService` - Gestión de usuarios
- `carsService` - Gestión de autos
- `repairsService` - Gestión de reparaciones
- `paymentsService` - Gestión de pagos
