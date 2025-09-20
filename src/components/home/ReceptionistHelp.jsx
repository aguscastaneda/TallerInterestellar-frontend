import { useState } from 'react';
import NavBar from '../NavBar';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../ui';
import { 
  Search, 
  User, 
  ClipboardList, 
  ArrowLeft,
  BookOpen,
  AlertTriangle,
  Info,
  CheckCircle,
  Settings
} from 'lucide-react';

const ReceptionistHelp = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Resumen General', icon: BookOpen },
    { id: 'busqueda', title: 'Búsqueda de Vehículos', icon: Search },
    { id: 'estados', title: 'Estados de Vehículos', icon: ClipboardList },
    { id: 'entrega', title: 'Entrega de Vehículos', icon: CheckCircle },
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
                Manual del Recepcionista
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Esta guía te ayudará a navegar todas las funcionalidades disponibles 
                en tu panel de recepcionista del taller.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-blue-600" />
                    <span>Búsqueda de Vehículos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Busca información completa de cualquier vehículo registrado.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Búsqueda por patente exacta</li>
                    <li>• Información del cliente</li>
                    <li>• Detalles del vehículo</li>
                    <li>• Estado actual del servicio</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ClipboardList className="h-5 w-5 text-green-600" />
                    <span>Gestión de Estados</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Supervisa todos los vehículos según su estado actual.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Filtrado por estados</li>
                    <li>• Información de clientes</li>
                    <li>• Seguimiento completo</li>
                    <li>• Acciones disponibles</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span>Entrega de Vehículos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Gestiona la entrega de vehículos finalizados a los clientes.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Vehículos listos para entrega</li>
                    <li>• Confirmación de entrega</li>
                    <li>• Cambio de estado automático</li>
                    <li>• Registro de entregas</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-yellow-600" />
                    <span>Información de Clientes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Accede a información detallada de los clientes.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Datos de contacto completos</li>
                    <li>• Historial de vehículos</li>
                    <li>• Estado de servicios</li>
                    <li>• Comunicación directa</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'busqueda':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Búsqueda de Vehículos</h2>
                <p className="text-gray-600">Encuentra información detallada de cualquier vehículo</p>
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
                    La barra de búsqueda te permite encontrar vehículos registrados por patente:
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Pasos para buscar:</h4>
                    <ol className="space-y-1 text-sm text-blue-800">
                      <li>1. Ingresa la patente exacta en la barra de búsqueda</li>
                      <li>2. Presiona Enter o haz clic en el botón buscar</li>
                      <li>3. El sistema mostrará la información del vehículo</li>
                      <li>4. Podrás desplegar información adicional del cliente</li>
                    </ol>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Información mostrada:</h4>
                    <ul className="space-y-1 text-sm text-green-800">
                      <li>• <strong>Patente:</strong> Identificación del vehículo</li>
                      <li>• <strong>Marca y modelo:</strong> Especificaciones del auto</li>
                      <li>• <strong>Cliente:</strong> Nombre del propietario</li>
                      <li>• <strong>Estado actual:</strong> Situación del vehículo</li>
                      <li>• <strong>Servicios:</strong> Trabajos realizados o pendientes</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">Si no encuentra el vehículo:</h4>
                    <ul className="space-y-1 text-sm text-red-800">
                      <li>• Verifica que la patente esté escrita correctamente</li>
                      <li>• Asegúrate de que no haya espacios extra</li>
                      <li>• El vehículo debe estar registrado en el sistema</li>
                      <li>• Aparecerá el mensaje &quot;Patente inexistente&quot;</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'estados':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Estados de Vehículos</h2>
                <p className="text-gray-600">Comprende cada estado y sus significados</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Estados Disponibles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Los vehículos pueden estar en diferentes estados según el progreso del servicio:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Entrada</h4>
                      <p className="text-sm text-gray-600">
                        Vehículo recién ingresado al taller, en proceso de recepción.
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2">Pendiente</h4>
                      <p className="text-sm text-yellow-800">
                        Esperando asignación de mecánico o inicio de trabajo.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">En Revisión</h4>
                      <p className="text-sm text-blue-800">
                        El mecánico está evaluando el vehículo y diagnosticando.
                      </p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2">Rechazado</h4>
                      <p className="text-sm text-red-800">
                        El trabajo no puede realizarse o fue rechazado.
                      </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">En Reparación</h4>
                      <p className="text-sm text-purple-800">
                        El mecánico está trabajando activamente en el vehículo.
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Finalizado</h4>
                      <p className="text-sm text-green-800">
                        Trabajo completado, listo para entrega al cliente.
                      </p>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2">Entregado</h4>
                      <p className="text-sm text-indigo-800">
                        Vehículo entregado al cliente, servicio completado.
                      </p>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Cancelado</h4>
                      <p className="text-sm text-orange-800">
                        El servicio fue cancelado por el cliente o el taller.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'entrega':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Entrega de Vehículos</h2>
                <p className="text-gray-600">Proceso para entregar vehículos finalizados</p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Proceso de Entrega</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Los vehículos en estado &quot;Finalizado&quot; están listos para ser entregados:
                  </p>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Pasos para entregar:</h4>
                    <ol className="space-y-1 text-sm text-green-800">
                      <li>1. Ve a la sección &quot;Finalizado&quot; en el filtro de estados</li>
                      <li>2. Identifica el vehículo del cliente que viene a retirar</li>
                      <li>3. Haz clic en &quot;Ver&quot; para revisar información del cliente</li>
                      <li>4. Verifica la identidad del cliente</li>
                      <li>5. Haz clic en &quot;Entregar&quot; para completar la entrega</li>
                      <li>6. El vehículo cambiará automáticamente a estado &quot;Entregado&quot;</li>
                    </ol>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Información a verificar:</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• <strong>Identidad del cliente:</strong> Confirmar que es el propietario</li>
                      <li>• <strong>Trabajos realizados:</strong> Revisar especificaciones del arreglo</li>
                      <li>• <strong>Costo total:</strong> Verificar el monto a cobrar</li>
                      <li>• <strong>Estado del vehículo:</strong> Asegurar que esté finalizado</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Importante:</h4>
                    <p className="text-sm text-yellow-800">
                      Una vez que haces clic en &quot;Entregar&quot;, el estado cambia automáticamente 
                      y el vehículo sale de la lista de finalizados. Esta acción no se puede deshacer.
                    </p>
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
                    <span>No encuentro un vehículo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      Si la búsqueda no encuentra un vehículo:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• <strong>Patente correcta:</strong> Verifica que esté escrita sin errores</li>
                      <li>• <strong>Sin espacios:</strong> Elimina espacios antes y después</li>
                      <li>• <strong>Formato:</strong> Asegúrate del formato correcto (ABC123)</li>
                      <li>• <strong>Registro:</strong> El vehículo debe estar registrado previamente</li>
                      <li>• <strong>Conexión:</strong> Verifica la conexión a internet</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>No aparecen vehículos en un estado</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      Si un filtro de estado aparece vacío:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• <strong>Estado real:</strong> No hay vehículos en ese estado actualmente</li>
                      <li>• <strong>Actualizar:</strong> Recarga la página (F5)</li>
                      <li>• <strong>Filtros:</strong> Verifica que el filtro esté aplicado correctamente</li>
                      <li>• <strong>Permisos:</strong> Confirma que tienes acceso a esa información</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>No puedo entregar un vehículo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      Si el botón &quot;Entregar&quot; no funciona:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• <strong>Estado correcto:</strong> Solo vehículos &quot;Finalizados&quot; pueden entregarse</li>
                      <li>• <strong>Permisos:</strong> Verifica que tengas permisos de recepcionista</li>
                      <li>• <strong>Conexión:</strong> Problemas de red pueden impedir la acción</li>
                      <li>• <strong>Sistema:</strong> Puede haber un error temporal del servidor</li>
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
                    o al jefe de mecánicos para obtener ayuda adicional.
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
            Manual completo para recepcionistas
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

export default ReceptionistHelp;