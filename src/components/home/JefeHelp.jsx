import { useState } from 'react';
import NavBar from '../NavBar';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '../ui';
import { 
  HelpCircle, 
  Users, 
  Wrench, 
  FileText, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle,
  ArrowLeft,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  Info
} from 'lucide-react';

const JefeHelp = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Resumen General', icon: BookOpen },
    { id: 'solicitudes', title: 'Solicitudes Clientes', icon: FileText },
    { id: 'asignadas', title: 'Solicitudes Asignadas', icon: Users },
    { id: 'mecanicos', title: 'Gestión de Mecánicos', icon: Wrench },
    { id: 'busqueda', title: 'Búsqueda de Vehículos', icon: Search },
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
                Manual del Jefe de Mecánico
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Este manual te guiará a través de todas las funcionalidades disponibles 
                en tu panel de control para gestionar eficientemente tu taller.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Gestión de Equipo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Administra tu equipo de mecánicos, crea nuevos usuarios y asigna trabajos.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Crear y editar mecánicos</li>
                    <li>• Ver trabajos activos por mecánico</li>
                    <li>• Gestionar información de contacto</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span>Control de Solicitudes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Supervisa todas las solicitudes de clientes y su progreso.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Revisar solicitudes pendientes</li>
                    <li>• Asignar trabajos a mecánicos</li>
                    <li>• Filtrar por estado y mecánico</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-purple-600" />
                    <span>Búsqueda Rápida</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Encuentra vehículos rápidamente por patente.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Buscar por número de patente</li>
                    <li>• Ver información del cliente</li>
                    <li>• Acceso rápido a historial</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    <span>Consejos de Eficiencia</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Optimiza tu flujo de trabajo con estos consejos.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Asigna trabajos según especialización</li>
                    <li>• Revisa cargas de trabajo regularmente</li>
                    <li>• Mantén comunicación con clientes</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'solicitudes':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Solicitudes de Clientes</h2>
                <p className="text-gray-600">Gestiona las solicitudes pendientes de asignación</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Revisar Solicitudes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    En esta sección verás todas las solicitudes que los clientes han enviado 
                    y que están esperando ser asignadas a un mecánico.
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Información que verás:</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• <strong>Vehículo:</strong> Patente, marca y modelo</li>
                      <li>• <strong>Cliente:</strong> Nombre completo del propietario</li>
                      <li>• <strong>Descripción:</strong> Detalles del problema o servicio</li>
                      <li>• <strong>Preferencia:</strong> Mecánico preferido (si aplica)</li>
                      <li>• <strong>Fecha:</strong> Cuándo se creó la solicitud</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Cómo asignar:</h4>
                    <ol className="space-y-1 text-sm text-green-800">
                      <li>1. Selecciona un mecánico del menú desplegable</li>
                      <li>2. El sistema mostrará cuántos trabajos activos tiene cada mecánico</li>
                      <li>3. Considera la especialización y carga de trabajo</li>
                      <li>4. La solicitud se moverá automáticamente a "Solicitudes Asignadas"</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'asignadas':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Solicitudes Asignadas</h2>
                <p className="text-gray-600">Supervisa el progreso de todos los trabajos</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Filtros de Estado</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Usa los filtros para ver solicitudes por estado y mecánico asignado.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2 flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Pendientes</span>
                      </h4>
                      <p className="text-sm text-yellow-800">
                        Trabajos asignados pero no iniciados por el mecánico.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                        <Wrench className="h-4 w-4" />
                        <span>En Proceso</span>
                      </h4>
                      <p className="text-sm text-blue-800">
                        Trabajos que el mecánico ha comenzado a realizar.
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Finalizadas</span>
                      </h4>
                      <p className="text-sm text-green-800">
                        Trabajos completados y listos para entrega.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Filtro por Mecánico</span>
                      </h4>
                      <p className="text-sm text-gray-800">
                        Ve solo los trabajos de un mecánico específico.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="h-5 w-5" />
                    <span>Información de Trabajos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Cada tarjeta de trabajo muestra información detallada:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• <strong>Vehículo y cliente:</strong> Identificación completa</li>
                    <li>• <strong>Estado actual:</strong> Con colores distintivos</li>
                    <li>• <strong>Mecánico asignado:</strong> Responsable del trabajo</li>
                    <li>• <strong>Fecha de creación:</strong> Cuándo se recibió la solicitud</li>
                    <li>• <strong>Descripción:</strong> Detalles del trabajo a realizar</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'mecanicos':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Mecánicos</h2>
                <p className="text-gray-600">Administra tu equipo de trabajo</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Crear Nuevo Mecánico</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Para agregar un nuevo mecánico a tu equipo:
                  </p>
                  
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li>1. Haz clic en el botón <Badge variant="primary">Crear Mecánico</Badge></li>
                    <li>2. Completa todos los campos obligatorios</li>
                    <li>3. El sistema enviará las credenciales por email</li>
                    <li>4. El mecánico podrá iniciar sesión inmediatamente</li>
                  </ol>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Campos requeridos:</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• <strong>Nombre y Apellido:</strong> Identificación completa</li>
                      <li>• <strong>Email:</strong> Para notificaciones y acceso</li>
                      <li>• <strong>Contraseña:</strong> Seguridad de la cuenta</li>
                      <li>• <strong>Teléfono:</strong> Contacto directo (opcional)</li>
                      <li>• <strong>CUIL:</strong> Identificación fiscal (opcional)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Edit className="h-5 w-5" />
                    <span>Gestionar Mecánicos Existentes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Para cada mecánico puedes realizar las siguientes acciones:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>Ver Detalles</span>
                      </h4>
                      <p className="text-sm text-green-800">
                        Información completa, estado de cuenta y trabajos activos.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                        <Edit className="h-4 w-4" />
                        <span>Editar Información</span>
                      </h4>
                      <p className="text-sm text-blue-800">
                        Actualizar datos de contacto y información personal.
                      </p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2 flex items-center space-x-2">
                        <Trash2 className="h-4 w-4" />
                        <span>Eliminar Cuenta</span>
                      </h4>
                      <p className="text-sm text-red-800">
                        Remover mecánico del sistema (acción irreversible).
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2 flex items-center space-x-2">
                        <Wrench className="h-4 w-4" />
                        <span>Trabajos Activos</span>
                      </h4>
                      <p className="text-sm text-yellow-800">
                        Ver cuántos trabajos tiene asignados actualmente.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'busqueda':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Búsqueda de Vehículos</h2>
                <p className="text-gray-600">Encuentra información rápida de cualquier vehículo</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5" />
                    <span>Cómo Buscar</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    La búsqueda por patente te permite acceder rápidamente a información 
                    de cualquier vehículo registrado en el sistema.
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Pasos para buscar:</h4>
                    <ol className="space-y-1 text-sm text-blue-800">
                      <li>1. Ingresa la patente en el campo de búsqueda</li>
                      <li>2. Haz clic en el botón "Buscar"</li>
                      <li>3. El sistema mostrará la información del vehículo</li>
                      <li>4. Podrás ver datos del cliente y historial</li>
                    </ol>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Información mostrada:</h4>
                    <ul className="space-y-1 text-sm text-green-800">
                      <li>• <strong>Patente:</strong> Número de identificación</li>
                      <li>• <strong>Marca y Modelo:</strong> Características del vehículo</li>
                      <li>• <strong>Cliente:</strong> Nombre del propietario</li>
                      <li>• <strong>Estado:</strong> Si tiene trabajos pendientes</li>
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
                    <span>No puedo ver solicitudes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      Si no aparecen solicitudes en tu panel, verifica:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• <strong>Filtros activos:</strong> Asegúrate de no tener filtros que oculten las solicitudes</li>
                      <li>• <strong>Conexión a internet:</strong> Verifica tu conexión</li>
                      <li>• <strong>Actualizar página:</strong> Recarga la página (F5)</li>
                      <li>• <strong>Permisos:</strong> Confirma que tienes acceso como jefe de mecánico</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>Error al crear mecánico</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      Si no puedes crear un nuevo mecánico:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• <strong>Email único:</strong> Verifica que el email no esté en uso</li>
                      <li>• <strong>Campos obligatorios:</strong> Completa nombre, apellido, email y contraseña</li>
                      <li>• <strong>Formato de email:</strong> Asegúrate de que sea un email válido</li>
                      <li>• <strong>Contraseña segura:</strong> Mínimo 6 caracteres</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>No puedo asignar trabajos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      Si tienes problemas para asignar trabajos:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• <strong>Mecánicos disponibles:</strong> Verifica que tengas mecánicos registrados</li>
                      <li>• <strong>Estado de la solicitud:</strong> Solo se pueden asignar solicitudes pendientes</li>
                      <li>• <strong>Permisos:</strong> Confirma que tienes permisos de jefe</li>
                      <li>• <strong>Recargar datos:</strong> Actualiza la página para obtener datos frescos</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <span>Contacto de Soporte</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Si continúas teniendo problemas, contacta al administrador del sistema 
                    o al equipo de soporte técnico para obtener ayuda adicional.
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
            Manual completo para jefes de mecánico
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
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-150 ${
                          activeSection === section.id
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

export default JefeHelp;
