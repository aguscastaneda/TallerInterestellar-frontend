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

## 🔑 Usuarios de Prueba

Para probar el sistema, usa estos usuarios (después de ejecutar el seed del backend):

### Jefe/Admin
- **Email**: admin@taller.com
- **Contraseña**: admin123

### Mecánicos
- **Email**: mecanico1@taller.com
- **Contraseña**: mecanico123
- **Email**: mecanico2@taller.com
- **Contraseña**: mecanico123

### Clientes
- **Email**: cliente1@email.com
- **Contraseña**: cliente123
- **Email**: cliente2@email.com
- **Contraseña**: cliente123

## 🎯 Funcionalidades por Rol

### Jefe/Admin
- ✅ Acceso completo a todas las funcionalidades
- ✅ Crear, editar y eliminar autos, reparaciones y pagos
- ✅ Asignar mecánicos a reparaciones
- ✅ Gestionar usuarios del sistema
- ✅ Ver estadísticas completas

### Mecánico
- ✅ Ver autos asignados
- ✅ Ver reparaciones asignadas
- ✅ Actualizar estado de reparaciones
- ✅ Ver historial de trabajo

### Cliente
- ✅ Ver sus autos
- ✅ Ver estado de reparaciones
- ✅ Ver historial de pagos
- ✅ Actualizar información personal

## 🏗️ Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/         # Componentes React
│   │   ├── Login.jsx      # Componente de login
│   │   └── Dashboard.jsx  # Dashboard principal
│   ├── contexts/          # Contextos de React
│   │   └── AuthContext.jsx # Contexto de autenticación
│   ├── services/          # Servicios de API
│   │   └── api.js         # Configuración de axios y servicios
│   ├── App.jsx            # Componente principal con routing
│   └── main.jsx           # Punto de entrada
├── public/                # Archivos estáticos
├── package.json           # Dependencias y scripts
├── tailwind.config.js     # Configuración de Tailwind
└── vite.config.js         # Configuración de Vite
```

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

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 🎯 Próximas Mejoras

- [ ] Formularios de creación/edición para entidades
- [ ] Filtros avanzados y búsqueda
- [ ] Paginación en tablas
- [ ] Exportación de datos
- [ ] Gráficos y reportes
- [ ] Notificaciones en tiempo real
- [ ] Modo oscuro
- [ ] Tests unitarios y de integración
- [ ] PWA capabilities
- [ ] Internacionalización

## 🐛 Solución de Problemas

### Error de conexión al backend
- Verificar que el backend esté corriendo en puerto 3001
- Revisar la configuración de CORS en el backend
- Verificar la URL en `src/services/api.js`

### Problemas de autenticación
- Limpiar localStorage del navegador
- Verificar que el token JWT sea válido
- Revisar la configuración del JWT_SECRET en el backend

### Errores de build
- Limpiar node_modules y reinstalar dependencias
- Verificar versiones de Node.js y npm
- Revisar compatibilidad de dependencias

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.
