import { useState } from 'react';
import NavBar from '../NavBar';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../ui';
import {
  Shield,
  Users,
  User,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  ArrowLeft,
  BookOpen,
  AlertTriangle,
  Info,
  UserCheck,
  Database,
  Lock
} from 'lucide-react';

const AdminHelp = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Resumen General', icon: BookOpen },
    { id: 'usuarios', title: 'Gestión de Usuarios', icon: Users },
    { id: 'vehiculos', title: 'Búsqueda de Vehículos', icon: Search },
    { id: 'roles', title: 'Administración de Roles', icon: Shield },
    { id: 'seguridad', title: 'Seguridad del Sistema', icon: Lock },
    { id: 'problemas', title: 'Problemas Comunes', icon: AlertTriangle }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Manual del Administrador
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Este manual te guiará a través de todas las funcionalidades administrativas
                para gestionar eficientemente el sistema del taller.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Gestión de Usuarios</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Administra todos los usuarios del sistema en un solo lugar.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Crear usuarios de cualquier rol</li>
                    <li>• Editar información de usuarios</li>
                    <li>• Activar/desactivar cuentas</li>
                    <li>• Ver detalles completos de usuarios</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-green-600" />
                    <span>Búsqueda de Vehículos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Busca información de cualquier vehículo registrado en el sistema.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Búsqueda por patente</li>
                    <li>• Información del propietario</li>
                    <li>• Estado actual del vehículo</li>
                    <li>• Historial de servicios</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <span>Control de Acceso</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Gestiona roles y permisos de usuarios del sistema.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Asignación de roles</li>
                    <li>• Control de permisos</li>
                    <li>• Auditoría de accesos</li>
                    <li>• Configuración de seguridad</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-yellow-600" />
                    <span>Monitoreo del Sistema</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Supervisa el funcionamiento y rendimiento del sistema.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Estadísticas de uso</li>
                    <li>• Reportes de actividad</li>
                    <li>• Mantenimiento de datos</li>
                    <li>• Backup y recuperación</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'usuarios':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
                <p className="text-gray-600">Administra todos los usuarios del sistema</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Crear Nuevos Usuarios</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Puedes crear usuarios para cualquier rol del sistema:
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Clientes</span>
                      </h4>
                      <p className="text-sm text-green-800">
                        Usuarios que pueden registrar vehículos y solicitar servicios.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                        <UserCheck className="h-4 w-4" />
                        <span>Mecánicos</span>
                      </h4>
                      <p className="text-sm text-blue-800">
                        Personal técnico que realiza reparaciones y mantenimiento.
                      </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2 flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Jefes de Mecánicos</span>
                      </h4>
                      <p className="text-sm text-purple-800">
                        Supervisores que asignan trabajos y gestionan equipos.
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Campos requeridos:</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• <strong>Nombre y Apellido:</strong> Identificación del usuario</li>
                      <li>• <strong>Email:</strong> Dirección única para acceso al sistema</li>
                      <li>• <strong>Contraseña:</strong> Credencial de seguridad</li>
                      <li>• <strong>CUIL:</strong> Identificación fiscal (opcional)</li>
                      <li>• <strong>Rol:</strong> Se asigna automáticamente según la pestaña activa</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Edit className="h-5 w-5" />
                    <span>Gestionar Usuarios Existentes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Para cada usuario puedes realizar las siguientes acciones:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>Ver Detalles</span>
                      </h4>
                      <p className="text-sm text-green-800">
                        Información completa del usuario, estado de cuenta y actividad.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                        <Edit className="h-4 w-4" />
                        <span>Editar Información</span>
                      </h4>
                      <p className="text-sm text-blue-800">
                        Actualizar datos personales y credenciales de acceso.
                      </p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2 flex items-center space-x-2">
                        <Trash2 className="h-4 w-4" />
                        <span>Activar/Desactivar</span>
                      </h4>
                      <p className="text-sm text-red-800">
                        Controlar el acceso al sistema sin eliminar la cuenta.
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2 flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Configuración</span>
                      </h4>
                      <p className="text-sm text-yellow-800">
                        Ajustar permisos y configuraciones específicas por usuario.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'vehiculos':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Búsqueda de Vehículos</h2>
                <p className="text-gray-600">Encuentra información de cualquier vehículo registrado</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5" />
                    <span>Cómo Buscar Vehículos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    La herramienta de búsqueda te permite acceder rápidamente a información
                    completa de cualquier vehículo registrado en el sistema.
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Pasos para buscar:</h4>
                    <ol className="space-y-1 text-sm text-blue-800">
                      <li>1. Ingresa la patente completa en el campo de búsqueda</li>
                      <li>2. Asegúrate de escribir la patente sin espacios ni guiones</li>
                      <li>3. Haz clic en el botón &quot;Buscar&quot;</li>
                      <li>4. El sistema mostrará toda la información disponible</li>
                    </ol>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Información mostrada:</h4>
                    <ul className="space-y-1 text-sm text-green-800">
                      <li>• <strong>Vehículo:</strong> Patente, marca, modelo y año</li>
                      <li>• <strong>Propietario:</strong> Nombre completo del cliente</li>
                      <li>• <strong>Estado actual:</strong> Si tiene trabajos pendientes o en proceso</li>
                      <li>• <strong>Contacto:</strong> Información de contacto del propietario</li>
                      <li>• <strong>Historial:</strong> Servicios anteriores realizados</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Casos de uso:</h4>
                    <ul className="space-y-1 text-sm text-yellow-800">
                      <li>• Verificar el propietario de un vehículo</li>
                      <li>• Consultar historial de servicios</li>
                      <li>• Localizar al cliente para comunicaciones</li>
                      <li>• Auditar trabajos realizados</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'roles':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Administración de Roles</h2>
                <p className="text-gray-600">Gestiona roles y permisos del sistema</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Roles del Sistema</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    El sistema maneja diferentes niveles de acceso según el rol asignado:
                  </p>

                  <div className="space-y-3">
                    <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                      <h4 className="font-semibold text-red-900 mb-2">Administrador</h4>
                      <p className="text-sm text-red-800">
                        Acceso completo al sistema. Puede gestionar usuarios, vehículos y configuraciones.
                      </p>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                      <h4 className="font-semibold text-orange-900 mb-2">Jefe de Mecánicos</h4>
                      <p className="text-sm text-orange-800">
                        Gestiona equipos de mecánicos, asigna trabajos y supervisa operaciones.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <h4 className="font-semibold text-blue-900 mb-2">Mecánico</h4>
                      <p className="text-sm text-blue-800">
                        Accede a trabajos asignados, actualiza estados y registra reparaciones.
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <h4 className="font-semibold text-green-900 mb-2">Cliente</h4>
                      <p className="text-sm text-green-800">
                        Registra vehículos, solicita servicios y consulta el estado de sus trabajos.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                      <h4 className="font-semibold text-gray-900 mb-2">Recepcionista</h4>
                      <p className="text-sm text-gray-800">
                        Gestiona el flujo de clientes y coordina la recepción de vehículos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'seguridad':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Seguridad del Sistema</h2>
                <p className="text-gray-600">Mejores prácticas y configuraciones de seguridad</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>Mejores Prácticas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">Gestión de Contraseñas:</h4>
                    <ul className="space-y-1 text-sm text-red-800">
                      <li>• Usar contraseñas complejas de al menos 8 caracteres</li>
                      <li>• Incluir mayúsculas, minúsculas, números y símbolos</li>
                      <li>• Cambiar contraseñas regularmente</li>
                      <li>• No compartir credenciales entre usuarios</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Control de Acceso:</h4>
                    <ul className="space-y-1 text-sm text-yellow-800">
                      <li>• Revisar regularmente usuarios activos</li>
                      <li>• Desactivar cuentas de usuarios inactivos</li>
                      <li>• Asignar roles según funciones específicas</li>
                      <li>• Auditar accesos y actividades</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Monitoreo:</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Revisar logs de acceso regularmente</li>
                      <li>• Identificar patrones de uso anómalos</li>
                      <li>• Mantener respaldos actualizados</li>
                      <li>• Reportar incidentes de seguridad</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'problemas':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Problemas Comunes</h2>
                <p className="text-gray-600">Soluciones a situaciones frecuentes</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>Error al crear usuario</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      Si no puedes crear un nuevo usuario:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• <strong>Email único:</strong> Verifica que el email no esté registrado</li>
                      <li>• <strong>Campos requeridos:</strong> Completa nombre, apellido, email y contraseña</li>
                      <li>• <strong>Formato email:</strong> Asegúrate de usar un formato válido</li>
                      <li>• <strong>Contraseña segura:</strong> Mínimo 6 caracteres</li>
                      <li>• <strong>Permisos:</strong> Confirma que tienes permisos de administrador</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>No puedo ver usuarios</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      Si la lista de usuarios aparece vacía:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• <strong>Conexión:</strong> Verifica tu conexión a internet</li>
                      <li>• <strong>Permisos:</strong> Confirma que tienes acceso administrativo</li>
                      <li>• <strong>Filtros:</strong> Revisa si hay filtros aplicados</li>
                      <li>• <strong>Actualizar:</strong> Recarga la página (F5)</li>
                      <li>• <strong>Datos:</strong> Puede que no haya usuarios registrados en esa categoría</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>Búsqueda de vehículo no funciona</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      Si no encuentras un vehículo:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• <strong>Formato patente:</strong> Verifica que esté escrita correctamente</li>
                      <li>• <strong>Sin espacios:</strong> Elimina espacios y caracteres especiales</li>
                      <li>• <strong>Mayúsculas:</strong> El sistema convierte automáticamente a mayúsculas</li>
                      <li>• <strong>Existencia:</strong> Confirma que el vehículo esté registrado</li>
                      <li>• <strong>Base de datos:</strong> Puede haber problemas de conectividad</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <span>Contacto de Soporte Técnico</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Si continúas teniendo problemas o necesitas asistencia técnica especializada,
                    contacta al equipo de desarrollo del sistema para obtener soporte avanzado.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar roleBadge={true} showHistory={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Volver
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Centro de Ayuda
          </h1>
          <p className="text-gray-600">
            Manual completo para administradores
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar de navegación */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Contenido</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-150 ${activeSection === section.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                {renderContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHelp;